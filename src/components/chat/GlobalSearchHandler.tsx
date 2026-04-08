"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function GlobalSearchHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (pathname === "/chat") {
          window.dispatchEvent(new CustomEvent("open-chat-search"));
        } else {
          router.push("/chat?search=1");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname, router]);

  return null;
}
