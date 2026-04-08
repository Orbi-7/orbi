"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BrokenCubeLogo } from "@/components/BrokenCubeLogo";
import { APPS } from "@/lib/apps";
import { Check, ExternalLink, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

interface ToolStatus {
  name: string;
  slug: string;
  isConnected: boolean;
}

export default function ConnectorsPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const userId = user?.id ?? "";
  const [toolkits, setToolkits] = useState<ToolStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/composio/toolkits?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((d) => setToolkits(d.toolkits ?? []))
      .catch(() => setToolkits([]))
      .finally(() => setLoading(false));
  }, [userId]);

  const isConnected = (id: string) =>
    toolkits.some(
      (t) =>
        (t.slug?.toLowerCase() === id.toLowerCase() || t.name?.toLowerCase() === id.toLowerCase()) &&
        t.isConnected
    );

  const handleConnect = async (id: string) => {
    setConnecting(id);
    try {
      const res = await fetch(
        `/api/composio/authorize?userId=${encodeURIComponent(userId)}&toolkit=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-6 backdrop-blur-md">
          <BrokenCubeLogo href="/" size="md" />
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="outline" size="sm" className="border-[var(--border)]">
                Open Chat
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Personal Information */}
        <Card className="mb-10 border-[var(--border)] bg-[var(--muted)]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/15">
                {user?.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-[var(--accent)]" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Personal information
                </h2>
                <p className="text-sm text-[var(--foreground)]/70">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Not set"}
                </p>
                <p className="text-sm text-[var(--foreground)]/60">
                  {user?.primaryEmailAddress?.emailAddress ?? "No email"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--border)]"
              onClick={() => openUserProfile?.()}
            >
              Manage account
            </Button>
          </CardHeader>
        </Card>

        <h1 className="text-3xl font-semibold tracking-tight">
          Connect your apps
        </h1>
        <p className="mt-2 text-[var(--foreground)]/70">
          Attach tools below. Then ask questions in chat like &quot;What&apos;s on my calendar?&quot; or &quot;Summarize my Slack.&quot;
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app) => {
            const connected = isConnected(app.id);
            return (
              <Card
                key={app.id}
                className="border-[var(--border)] bg-[var(--muted)]/30 transition hover:border-[var(--accent)]/50"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[var(--muted)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.logo}
                        alt=""
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                      <span className="hidden text-lg font-medium text-[var(--accent)]">
                        {app.name.charAt(0)}
                      </span>
                    </div>
                    {connected && <Check className="h-5 w-5 text-[var(--accent)]" />}
                  </div>
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-sm text-[var(--foreground)]/60">{app.desc}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    size="sm"
                    className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90"
                    variant={connected ? "outline" : "default"}
                    disabled={connecting === app.id}
                    onClick={() => handleConnect(app.id)}
                  >
                    {connecting === app.id ? (
                      "Connecting..."
                    ) : connected ? (
                      "Connected"
                    ) : (
                      <>
                        Connect <ExternalLink className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading && (
          <div className="mt-8 text-center text-sm text-[var(--foreground)]/60">
            Loading...
          </div>
        )}
      </main>
    </div>
  );
}
