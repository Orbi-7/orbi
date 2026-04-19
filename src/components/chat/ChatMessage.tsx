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
        "flex w-full py-4 border-b border-[var(--border)]",
        isUser ? "bg-[var(--background)]" : "bg-[var(--assistant-bg)]"
      )}
    >
      <div className="w-full px-4 md:px-0">
        <p
          className={cn(
            "text-xs font-mono mb-2 uppercase tracking-wider",
            isUser ? "text-[var(--foreground)]/50" : "text-[var(--accent)]"
          )}
        >
          {isUser ? "> USER" : "> ORBI"}
        </p>
        <p
          className={cn(
            "whitespace-pre-wrap leading-relaxed font-mono text-sm",
            isUser ? "text-[var(--foreground)]/90" : "text-[var(--foreground)]"
          )}
        >
          {showThinking ? (
            <span className="inline-block h-4 w-2 animate-pulse bg-[var(--accent)]" />
          ) : (
            contentToShow
          )}
        </p>
      </div>
    </div>
  );
}
