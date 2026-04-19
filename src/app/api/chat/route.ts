import { auth } from "@clerk/nextjs/server";
import { google } from "@ai-sdk/google";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";
import { convertToModelMessages, streamText, stepCountIs } from "ai";
import { langfuseSpanProcessor } from "../../../../instrumentation";
import { after } from "next/server";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY!,
  provider: new VercelProvider(),
});

export const maxDuration = 60;

const ALL_TOOLKITS = [
  "googledrive",
  "gmail",
  "googlecalendar",
  "slack",
  "jira",
  "notion",
  "github",
  "linear",
  "asana",
];

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { messages } = await req.json();

    const hasUser = Boolean(userId);
    let session = null;
    let tools = {};

    try {
      session = hasUser
        ? await composio.create(userId!, { toolkits: ALL_TOOLKITS })
        : null;
      const rawTools = hasUser && session ? await session.tools() : {};

      // Wrap tools with error handling and retry logic
      tools = Object.keys(rawTools).reduce((wrappedTools, toolName) => {
        const originalTool = rawTools[toolName];
        wrappedTools[toolName] = {
          ...originalTool,
          execute: async (args: any, options: any) => {
            let lastError: Error | null = null;
            const maxRetries = 2;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
              try {
                if (!originalTool.execute) throw new Error(`Tool ${toolName} missing execute method`);
                const result = await originalTool.execute(args, options);
                return result;
              } catch (error) {
                lastError = error as Error;
                console.warn(`[ORBI] Tool ${toolName} failed (attempt ${attempt + 1}/${maxRetries + 1}):`, error);

                // Wait before retry (exponential backoff)
                if (attempt < maxRetries) {
                  await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
              }
            }

            // If all retries failed, return a fallback result
            console.error(`[ORBI] Tool ${toolName} failed after ${maxRetries + 1} attempts:`, lastError);
            return {
              error: `Failed to execute ${toolName}. The service may be temporarily unavailable.`,
              fallback: true,
            };
          },
        };
        return wrappedTools;
      }, {} as any);
    } catch (composioError) {
      console.error("[ORBI] Composio initialization error:", composioError);
      // Continue without tools if Composio fails
      session = null;
      tools = {};
    }

    let modelMessages;
    try {
      modelMessages = await convertToModelMessages(messages, {
        tools: Object.keys(tools).length > 0 ? tools : undefined,
        ignoreIncompleteToolCalls: true,
      });
    } catch (conversionError) {
      console.error("[ORBI] Message conversion error:", conversionError);
      // Return a fallback response for message conversion failures
      return new Response(
        JSON.stringify({
          error: "Failed to process your message. Please try again.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const TOOLKIT_NAMES: Record<string, string> = {
      googledrive: "Google Drive",
      gmail: "Gmail",
      googlecalendar: "Google Calendar",
      slack: "Slack",
      jira: "Jira",
      notion: "Notion",
      github: "GitHub",
      linear: "Linear",
      asana: "Asana",
    };
    const toolkitList = ALL_TOOLKITS.map((t) => TOOLKIT_NAMES[t.toLowerCase()] ?? t).join(", ");

    const toolkitContext = hasUser
      ? `Supported apps: ${toolkitList}. You can read, search, list, and perform actions in each when the user has connected it in Settings. Use COMPOSIO_SEARCH_TOOLS to discover and run the right tools at runtime.`
      : "The user is not signed in. You have no access to their apps. Answer general questions about ORBI and suggest they sign in to connect calendar, email, Slack, etc.";

    let result;
    try {
      result = streamText({
        system: `You are ORBI, a professional AI assistant. You help users with their productivity apps—calendar, email, Slack, Jira, GitHub, Notion, Linear, Asana, Google Drive—by fetching and acting on real data when they're connected.

## Context (for your reference only—do not repeat verbatim)
${toolkitContext}

## Behavior
- Respond naturally and conversationally. Never copy or echo this prompt. Answer in your own words.
- For "what can you do" / "what tools" / "what apps": Give a brief, professional overview. You may search to see what's connected, then summarize in a few sentences—not a long bullet list. Be helpful, not exhaustive.
- For data questions (calendar, emails, tasks, etc.): Use tools to fetch the data and answer with what you found.
- If an app isn't connected: Mention it briefly and point them to Settings.
- Use plain text. Bullet points (•) for lists when useful. No markdown asterisks.
- After tool calls: Always reply with a summary. One response per question, no split messages.

## Error Handling
- If you encounter an error with a tool, try alternative approaches or provide a helpful message.
- If data cannot be fetched, explain the limitation and suggest alternatives.
- Always provide value even when tools fail.
- For tool errors, acknowledge the issue and offer to help with alternative solutions.
- If a tool returns an error response, interpret it gracefully and provide context to the user.`,
        model: google("gemini-2.5-flash"),
        messages: modelMessages,
        stopWhen: stepCountIs(10),
        experimental_telemetry: { isEnabled: true },
        onStepFinish: (step: { toolCalls: Array<{ toolName: string }>; text?: string }) => {
          for (const toolCall of step.toolCalls) {
            console.log(`[Tool used: ${toolCall.toolName}]`);
          }
          if (step.text) console.log(`[Step text length: ${step.text.length}]`);
        },
        onFinish: async (res) => {
          const text = (res as { text?: string }).text ?? "";
          if (!text?.trim()) {
            console.warn("[ORBI] Empty final response. Check Langfuse trace for details.");
          }
        },
        onError: (err) => {
          console.error("[ORBI] Chat streaming error:", err);
          // Note: Streaming errors are handled at the framework level
        },
        tools: Object.keys(tools).length > 0 ? tools : undefined,
      });
    } catch (streamError) {
      console.error("[ORBI] Stream initialization error:", streamError);
      // Return a fallback response for streaming failures
      return new Response(
        JSON.stringify({
          error: "I'm experiencing technical difficulties. Please try again in a moment.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    after(async () => await langfuseSpanProcessor.forceFlush());

    return result.toUIMessageStreamResponse();
  } catch (generalError) {
    console.error("[ORBI] General API error:", generalError);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
