"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ExternalLink, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

const POPULAR_TOOLS = [
  { id: "googlecalendar", name: "Google Calendar" },
  { id: "gmail", name: "Gmail" },
  { id: "slack", name: "Slack" },
  { id: "jira", name: "Jira" },
  { id: "github", name: "GitHub" },
  { id: "notion", name: "Notion" },
  { id: "linear", name: "Linear" },
  { id: "asana", name: "Asana" },
  { id: "googledrive", name: "Google Drive" },
];

interface ToolStatus {
  name: string;
  slug: string;
  isConnected: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function SettingsPanel({ isOpen, onClose, userId }: SettingsPanelProps) {
  const [toolkits, setToolkits] = useState<ToolStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectingToolkit, setConnectingToolkit] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchToolkits();
    }
  }, [isOpen, userId]);

  const fetchToolkits = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/composio/toolkits?userId=${encodeURIComponent(userId)}`
      );
      const data = await res.json();
      if (data.toolkits) setToolkits(data.toolkits);
    } catch {
      setToolkits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (toolkitId: string) => {
    setConnectingToolkit(toolkitId);
    try {
      const res = await fetch(
        `/api/composio/authorize?userId=${encodeURIComponent(userId)}&toolkit=${encodeURIComponent(toolkitId)}`
      );
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      setConnectingToolkit(null);
    }
  };

  const isConnected = (toolkitId: string) =>
    toolkits.some(
      (t) =>
        (t.slug?.toLowerCase() === toolkitId.toLowerCase() ||
          t.name?.toLowerCase() === toolkitId.toLowerCase()) &&
        t.isConnected
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden border-[var(--border)] bg-[var(--background)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[var(--foreground)]">Connected tools</CardTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <p className="mb-4 text-sm text-[var(--foreground)]/70">
            Connect your apps to get AI insights about your calendar, emails,
            issues, and more.
          </p>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--foreground)]/50" />
            </div>
          ) : (
            <div className="space-y-2">
              {POPULAR_TOOLS.map((tool) => {
                const connected = isConnected(tool.id);
                return (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)]/15 text-sm font-medium text-[var(--accent)]">
                        {tool.name.charAt(0)}
                      </div>
                      <span className="font-medium">{tool.name}</span>
                      {connected && (
                        <Check className="h-4 w-4 text-[var(--accent)]" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={connected ? "outline" : "default"}
                      disabled={connectingToolkit === tool.id}
                      onClick={() => handleConnect(tool.id)}
                      className={!connected ? "bg-[var(--accent)] text-[var(--accent-foreground)]" : ""}
                    >
                      {connectingToolkit === tool.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : connected ? (
                        "Connected"
                      ) : (
                        <>
                          Connect <ExternalLink className="ml-1 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
