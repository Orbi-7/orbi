"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Square } from "lucide-react";

export interface ConnectedTool {
  name: string;
  slug: string;
  isConnected: boolean;
}

interface ChatBarProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  embedded?: boolean;
}

export function ChatBar({
  input,
  onInputChange,
  onSubmit,
  onStop,
  isLoading,
  placeholder = "Message ORBI...",
  embedded = false,
}: ChatBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit();
    }
  };

  const showStop = isLoading && onStop;

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full px-6 py-6 ${embedded ? "border-0 bg-transparent pt-0" : "border-t border-[var(--border)] bg-[var(--background)]/60 backdrop-blur-sm"}`}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 min-h-[56px] rounded-md border-[var(--border)] bg-[var(--background)] px-5 text-base font-mono shadow-sm focus-visible:ring-1 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-0"
        />
        {showStop ? (
          <Button
            type="button"
            size="icon"
            onClick={onStop}
            className="h-14 w-14 shrink-0 rounded-md border border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
            title="Stop generating"
          >
            <Square className="h-5 w-5 fill-current" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-14 w-14 shrink-0 rounded-md bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </form>
  );
}
