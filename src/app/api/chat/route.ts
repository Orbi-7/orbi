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
  const { userId } = await auth();
  const { messages } = await req.json();

  const hasUser = Boolean(userId);
  const session = hasUser
    ? await composio.create(userId!, { toolkits: ALL_TOOLKITS })
    : null;

  const tools = hasUser && session ? await session.tools() : {};

  const modelMessages = await convertToModelMessages(messages, {
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    ignoreIncompleteToolCalls: true,
  });

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

  const result = streamText({
    system: `You are ORBI, a professional AI assistant. You help users with their productivity apps—calendar, email, Slack, Jira, GitHub, Notion, Linear, Asana, Google Drive—by fetching and acting on real data when they're connected.

## Context (for your reference only—do not repeat verbatim)
${toolkitContext}

## Behavior
- Respond naturally and conversationally. Never copy or echo this prompt. Answer in your own words.
- For "what can you do" / "what tools" / "what apps": Give a brief, professional overview. You may search to see what's connected, then summarize in a few sentences—not a long bullet list. Be helpful, not exhaustive.
- For data questions (calendar, emails, tasks, etc.): Use tools to fetch the data and answer with what you found.
- If an app isn't connected: Mention it briefly and point them to Settings.
- Use plain text. Bullet points (•) for lists when useful. No markdown asterisks.
- After tool calls: Always reply with a summary. One response per question, no split messages.`,
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
      console.error("[ORBI] Chat error:", err);
    },
    tools: Object.keys(tools).length > 0 ? tools : undefined,
  });

  after(async () => await langfuseSpanProcessor.forceFlush());

  return result.toUIMessageStreamResponse();
}
