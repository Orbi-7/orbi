import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const toolCallValidator = v.object({
  name: v.string(),
  args: v.any(),
});

export const add = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    toolCalls: v.optional(v.array(toolCallValidator)),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      toolCalls: args.toolCalls,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();
  },
});

export const search = query({
  args: {
    userId: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const q = args.query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_user", (idx) => idx.eq("userId", args.userId))
      .order("desc")
      .take(50);

    const matches: {
      conversationId: Id<"conversations">;
      conversationTitle: string;
      messageId: Id<"messages">;
      excerpt: string;
      role: "user" | "assistant";
      content: string;
    }[] = [];

    for (const conv of conversations) {
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (idx) => idx.eq("conversationId", conv._id))
        .order("asc")
        .collect();

      for (const msg of msgs) {
        if (msg.role === "system") continue;
        const content = msg.content;
        const idx = content.toLowerCase().indexOf(q);
        if (idx === -1) continue;

        const excerptLen = 80;
        const start = Math.max(0, idx - excerptLen / 2);
        const end = Math.min(content.length, idx + q.length + excerptLen / 2);
        let excerpt = content.slice(start, end);
        if (start > 0) excerpt = "…" + excerpt;
        if (end < content.length) excerpt = excerpt + "…";

        matches.push({
          conversationId: conv._id,
          conversationTitle: conv.title,
          messageId: msg._id,
          excerpt,
          role: msg.role as "user" | "assistant",
          content,
        });
      }
    }

    return matches.slice(0, 20);
  },
});
