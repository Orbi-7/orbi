import { Composio } from "@composio/core";
import { NextRequest } from "next/server";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY!,
});

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

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const toolkit = req.nextUrl.searchParams.get("toolkit");

  if (!userId || !toolkit) {
    return Response.json(
      { error: "Missing userId or toolkit" },
      { status: 400 }
    );
  }

  const normalizedToolkit = toolkit.toLowerCase().replace(/\s/g, "");
  const composioToolkit = TOOLKIT_MAP[normalizedToolkit] ?? normalizedToolkit;

  try {
    const session = await composio.create(userId);
    const connectionRequest = await session.authorize(composioToolkit, {
      callbackUrl: `${req.nextUrl.origin}/chat?status=connected`,
    });

    return Response.json({
      redirectUrl: connectionRequest.redirectUrl,
    });
  } catch (err) {
    console.error("Composio authorize error:", err);
    return Response.json(
      { error: "Failed to create authorization link" },
      { status: 500 }
    );
  }
}
