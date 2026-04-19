"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

interface Conversation {
  _id: Id<"conversations">;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface ChatHistoryProps {
  conversations: Conversation[] | undefined;
  activeId: Id<"conversations"> | null;
  onSelect: (id: Id<"conversations">) => void;
  onNew: () => void;
  onDelete: (id: Id<"conversations">) => void;
}

export function ChatHistory({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ChatHistoryProps) {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--background)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-3">
        <span className="text-sm font-mono tracking-tight uppercase text-[var(--foreground)]">Chats</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={onNew}
          className="h-9 w-9 rounded-md border border-[var(--border)] bg-[var(--background)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {!conversations?.length ? (
          <p className="px-2 py-4 text-center text-sm text-[var(--foreground)]/60">
            No chats yet
          </p>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2.5 text-sm font-mono transition-colors border-l-2",
                  activeId === conv._id
                    ? "border-[var(--accent)] bg-[var(--muted)] text-[var(--foreground)]"
                    : "border-transparent hover:border-[var(--border)] hover:bg-[var(--card)]"
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(conv._id)}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-[var(--foreground)]/60" />
                  <span className="truncate">{conv.title}</span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 rounded-lg opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv._id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
