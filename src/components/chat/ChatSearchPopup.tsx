"use client";

import { useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { MessageSquare, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Match {
  conversationId: Id<"conversations">;
  conversationTitle: string;
  messageId: string;
  excerpt: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSearchPopupProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userId: string;
  onSelectMatch: (conversationId: Id<"conversations">, query: string) => void;
  localMatches?: Match[];
}

export function ChatSearchPopup({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  userId,
  onSelectMatch,
  localMatches = [],
}: ChatSearchPopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const dbMatches = useQuery(
    api.messages.search,
    open && userId && searchQuery.trim().length >= 2
      ? { userId, query: searchQuery.trim() }
      : "skip"
  );

  const matches: Match[] = dbMatches === undefined
    ? localMatches
    : (() => {
        const localKeys = new Set(localMatches.map((l) => `${l.conversationId}-${l.content.slice(0, 50)}`));
        const fromDb = dbMatches.filter((m) => !localKeys.has(`${m.conversationId}-${m.content.slice(0, 50)}`));
        return [...localMatches, ...fromDb];
      })();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const highlightExcerpt = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark key={i} className="bg-[var(--accent)]/40 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed left-1/2 top-[20%] z-[9999] flex max-h-[85vh] w-full max-w-xl -translate-x-1/2 flex-col rounded-3xl border border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search chats"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search across all chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted-foreground)]"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--muted)]/50"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!userId ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              Sign in to search your chats
            </p>
          ) : !searchQuery.trim() ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              Type at least 2 characters to search
            </p>
          ) : searchQuery.trim().length < 2 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              Keep typing to search...
            </p>
          ) : dbMatches === undefined && !localMatches.length ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-[var(--muted-foreground)]">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              Searching...
            </div>
          ) : matches.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
              No matches found for &quot;{searchQuery}&quot;
            </p>
          ) : (
            <div className="space-y-0.5">
              {matches.map((m) => (
                <button
                  key={`${m.conversationId}-${m.messageId}`}
                  type="button"
                  onClick={() => {
                    onSelectMatch(m.conversationId, searchQuery.trim());
                    onClose();
                    onSearchChange("");
                  }}
                  className={cn(
                    "flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors",
                    "hover:bg-[var(--muted)]/60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                    <span className="truncate text-sm font-medium text-[var(--foreground)]">
                      {m.conversationTitle || "Untitled"}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-xs",
                        m.role === "user"
                          ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      )}
                    >
                      {m.role === "user" ? "You" : "ORBI"}
                    </span>
                  </div>
                  <p className="truncate pl-6 text-sm text-[var(--muted-foreground)]">
                    {highlightExcerpt(m.excerpt, searchQuery.trim())}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
