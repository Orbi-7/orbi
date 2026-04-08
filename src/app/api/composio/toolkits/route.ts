import { Composio } from "@composio/core";
import { NextRequest } from "next/server";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY!,
});

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const session = await composio.create(userId);
    const toolkits = await session.toolkits();

    const result = toolkits.items.map((t) => ({
      name: t.name ?? t.slug ?? "",
      slug: t.slug ?? t.name,
      isConnected: !!t.connection?.connectedAccount?.id,
    }));

    return Response.json({ toolkits: result });
  } catch (err) {
    console.error("Composio toolkits error:", err);
    return Response.json(
      { error: "Failed to fetch toolkits" },
      { status: 500 }
    );
  }
}
