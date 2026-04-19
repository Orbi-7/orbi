import { Composio } from "@composio/core";
import { NextRequest } from "next/server";

function getComposio() {
  return new Composio({
    apiKey: process.env.COMPOSIO_API_KEY as string,
  });
}

const TOOLKIT_MAP: Record<string, string> = {
  googlecalendar: "googlecalendar",
  gmail: "gmail",
  slack: "slack",
  jira: "jira",
  notion: "notion",
  github: "github",
  linear: "linear",
  asana: "asana",
  googledrive: "googledrive",
};

export async function POST(req: NextRequest) {
  const { userId, toolkit } = await req.json();

  if (!userId || !toolkit) {
    return Response.json(
      { error: "Missing userId or toolkit" },
      { status: 400 }
    );
  }

  const normalizedToolkit = toolkit.toLowerCase().replace(/\s/g, "");
  const composioToolkit = TOOLKIT_MAP[normalizedToolkit] ?? normalizedToolkit;

  try {
    const session = await getComposio().create(userId);
    const toolkits = await session.toolkits();

    // Find the toolkit and disconnect its connection
    const targetToolkit = toolkits.items.find(
      (t) => t.slug?.toLowerCase() === composioToolkit.toLowerCase()
    );

    if (!targetToolkit || !targetToolkit.connection?.connectedAccount?.id) {
      return Response.json(
        { error: "Tool not connected or account not found" },
        { status: 404 }
      );
    }

    // Disconnect the account
    await (targetToolkit.connection as any).disconnect();

    return Response.json({
      success: true,
      message: `${toolkit} has been disconnected.`,
    });
  } catch (err) {
    console.error(`[ORBI] Composio disconnect error for ${toolkit}:`, err);
    return Response.json(
      {
        error: `Failed to disconnect ${toolkit}. Please try again.`,
      },
      { status: 500 }
    );
  }
}
