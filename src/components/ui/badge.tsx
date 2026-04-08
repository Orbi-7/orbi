import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" &&
          "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
        variant === "secondary" &&
          "border-transparent bg-[var(--muted)] text-[var(--foreground)]",
        variant === "destructive" &&
          "border-transparent bg-red-500 text-white",
        variant === "outline" &&
          "border-[var(--border)] text-[var(--foreground)]",
        variant === "ghost" &&
          "border-transparent hover:bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
