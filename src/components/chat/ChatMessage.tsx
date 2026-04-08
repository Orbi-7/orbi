"use client";

import { stripMarkdownAsterisks } from "@/lib/format-message";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  searchHighlight?: string;
}

function highlightMatches(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-[var(--accent)]/40 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function ChatMessage({ role, content, isStreaming, searchHighlight }: ChatMessageProps) {
  const displayContent =
    role === "assistant" ? stripMarkdownAsterisks(content) : content;
  const isUser = role === "user";
  const showThinking = role === "assistant" && !displayContent?.trim() && isStreaming;
  const contentToShow = showThinking ? null : (searchHighlight ? highlightMatches(displayContent, searchHighlight) : displayContent);

  return (
    <div
      className={cn(
        "flex w-full py-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "overflow-hidden rounded-3xl px-4 py-3 shadow-sm",
          isUser
            ? "max-w-[80%] bg-[var(--accent)]"
            : "max-w-full bg-[var(--assistant-bg)] border border-[var(--border)]"
        )}
      >
        <p
          className={cn(
            "text-xs font-medium mb-1",
            isUser ? "text-[var(--accent-foreground)]/80" : "text-[var(--foreground)]/60"
          )}
        >
          {isUser ? "You" : "ORBI"}
        </p>
        <p
          className={cn(
            "whitespace-pre-wrap leading-relaxed",
            isUser ? "text-[var(--accent-foreground)]" : "text-[var(--foreground)]"
          )}
        >
          {showThinking ? (
            <span className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "300ms" }} />
            </span>
          ) : (
            contentToShow
          )}
        </p>
      </div>
    </div>
  );
}
