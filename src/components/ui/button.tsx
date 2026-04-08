import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "default" &&
            "bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 focus-visible:ring-[var(--ring)]",
          variant === "outline" &&
            "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] focus-visible:ring-[var(--ring)]",
          variant === "ghost" &&
            "hover:bg-[var(--muted)] focus-visible:ring-[var(--ring)]",
          variant === "link" &&
            "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 rounded-md px-3",
          size === "lg" && "h-11 rounded-md px-8",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
