import Link from "next/link";

interface OrbiLogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

export function OrbiLogo({ className = "", href = "/", size = "md" }: OrbiLogoProps) {
  const sizeMap = { sm: "h-6 w-6 text-xs", md: "h-8 w-8 text-sm", lg: "h-10 w-10 text-base" };
  const iconClasses = sizeMap[size];

  const logo = (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] font-bold text-[var(--accent-foreground)] ${iconClasses}`}
      >
        O
      </span>
      <span className="font-bold tracking-tight text-[var(--foreground)]">
        RBI
      </span>
    </span>
  );

  return href ? <Link href={href}>{logo}</Link> : logo;
}
