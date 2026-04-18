"use client";

import { ChatBar, type ConnectedTool } from "@/components/chat/ChatBar";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSearchPopup } from "@/components/chat/ChatSearchPopup";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Menu, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrokenCubeLogo } from "@/components/BrokenCubeLogo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? "";
  const isSignedIn = Boolean(userId);
  const isLoadingAuth = !isLoaded;

  const [activeConversationId, setActiveConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connectedTools, setConnectedTools] = useState<ConnectedTool[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState("");

  const conversations = useQuery(
    api.conversations.list,
    userId ? { userId } : "skip"
  );
  const messages = useQuery(
    api.messages.list,
    activeConversationId ? { conversationId: activeConversationId } : "skip"
  );

  const createConversation = useMutation(api.conversations.create);
  const deleteConversation = useMutation(api.conversations.remove);
  const addMessage = useMutation(api.messages.add);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/composio/toolkits?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((data) => data.toolkits && setConnectedTools(data.toolkits))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (searchParams.get("search") === "1") {
      setSearchOpen(true);
      window.history.replaceState({}, "", "/chat");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleOpen = () => setSearchOpen(true);
    window.addEventListener("open-chat-search", handleOpen);
    return () => window.removeEventListener("open-chat-search", handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { userId, conversationId: activeConversationId },
      }),
    [activeConversationId, userId]
  );

  const {
    messages: chatMessages,
    sendMessage,
    status,
    setMessages,
    stop: stopGeneration,
  } = useChat({
    transport,
    onFinish: async ({ message }) => {
      try {
        if (activeConversationId) {
          const text =
            typeof (message as { parts?: Array<{ type: string; text?: string }> })
              .parts === "undefined"
              ? ""
              : (message as { parts: Array<{ type: string; text?: string }> }).parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text ?? "")
                  .join("");

          if (!text?.trim()) {
            // Handle empty response with fallback
            const fallbackText = "I apologize, but I wasn't able to generate a response. This might be due to a temporary service issue. Please try rephrasing your question.";
            await addMessage({
              conversationId: activeConversationId,
              role: "assistant",
              content: fallbackText,
            });
            return;
          }

          await addMessage({
            conversationId: activeConversationId,
            role: "assistant",
            content: text,
          });
        }
      } catch (error) {
        console.error("[ORBI] Error saving assistant message:", error);
        // Add error message to chat
        if (activeConversationId) {
          await addMessage({
            conversationId: activeConversationId,
            role: "assistant",
            content: "I encountered an error while processing your request. Please try again.",
          });
        }
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleNewChat = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, [setMessages]);

  const lastSyncedConvId = useRef<Id<"conversations"> | null>(null);

  const handleSelectConversation = useCallback(
    (id: Id<"conversations">) => {
      setActiveConversationId(id);
      lastSyncedConvId.current = null;
      setMessages([]);
      setSearchHighlight("");
    },
    [setMessages]
  );

  const localMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!searchOpen || !activeConversationId || q.length < 2 || !conversations) return [];
    const conv = conversations.find((c) => c._id === activeConversationId);
    const title = conv?.title ?? "Chat";
    const allMessages: { content: string; role: string; id: string }[] = [];
    for (const m of chatMessages) {
      const text =
        "parts" in m && Array.isArray((m as { parts?: { type: string; text?: string }[] }).parts)
          ? (m as { parts: { type: string; text?: string }[] }).parts
              .filter((p) => p.type === "text")
              .map((p) => p.text ?? "")
              .join("")
          : String((m as { content?: string }).content ?? "");
      if (text && (m.role === "user" || m.role === "assistant")) {
        allMessages.push({ content: text, role: m.role, id: m.id });
      }
    }
    const matches: { conversationId: Id<"conversations">; conversationTitle: string; messageId: string; excerpt: string; role: "user" | "assistant"; content: string }[] = [];
    for (const m of allMessages) {
      const idx = m.content.toLowerCase().indexOf(q);
      if (idx === -1) continue;
      const excerptLen = 80;
      const start = Math.max(0, idx - excerptLen / 2);
      const end = Math.min(m.content.length, idx + q.length + excerptLen / 2);
      let excerpt = m.content.slice(start, end);
      if (start > 0) excerpt = "…" + excerpt;
      if (end < m.content.length) excerpt = excerpt + "…";
      matches.push({
        conversationId: activeConversationId,
        conversationTitle: title,
        messageId: m.id,
        excerpt,
        role: m.role as "user" | "assistant",
        content: m.content,
      });
    }
    return matches;
  }, [searchOpen, searchQuery, activeConversationId, chatMessages, conversations]);

  const handleSelectSearchMatch = useCallback(
    (conversationId: Id<"conversations">, highlightQuery: string) => {
      handleSelectConversation(conversationId);
      setSearchHighlight(highlightQuery);
    },
    [handleSelectConversation]
  );

  useEffect(() => {
    if (
      activeConversationId &&
      messages?.length &&
      lastSyncedConvId.current !== activeConversationId
    ) {
      lastSyncedConvId.current = activeConversationId;
      setMessages(
        messages.map((m) => ({
          id: String(m._id),
          role: m.role as "user" | "assistant" | "system",
          parts: [{ type: "text" as const, text: m.content }],
        }))
      );
    }
  }, [activeConversationId, messages, setMessages]);

  const handleDeleteConversation = useCallback(
    (id: Id<"conversations">) => {
      deleteConversation({ id });
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    },
    [deleteConversation, activeConversationId, setMessages]
  );

  const handleSendWithMessage = useCallback(
    async (userContent: string) => {
      if (!userContent.trim()) return;
      const text = userContent.trim();
      setInput("");

      try {
        const doSend = () => sendMessage({ text });
        if (!isSignedIn) {
          doSend();
          return;
        }
        if (!activeConversationId) {
          const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
          const conversationId = await createConversation({ userId, title });
          setActiveConversationId(conversationId);
          await addMessage({ conversationId, role: "user", content: text });
          doSend();
        } else {
          await addMessage({
            conversationId: activeConversationId,
            role: "user",
            content: text,
          });
          doSend();
        }
      } catch (error) {
        console.error("[ORBI] Error sending message:", error);
        // Add an error message to the chat
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          role: "assistant",
          parts: [{ type: "text", text: "Sorry, I encountered an error while processing your message. Please try again." }]
        }]);
      }
    },
    [
      isSignedIn,
      activeConversationId,
      userId,
      createConversation,
      addMessage,
      sendMessage,
      setMessages,
    ]
  );

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    handleSendWithMessage(input);
  }, [input, handleSendWithMessage]);

  const initialMessage = searchParams.get("message");
  const hasProcessedInitial = useRef(false);
  useEffect(() => {
    if (
      !isLoadingAuth &&
      initialMessage?.trim() &&
      !hasProcessedInitial.current
    ) {
      hasProcessedInitial.current = true;
      const msg = initialMessage.trim();
      window.history.replaceState({}, "", "/chat");
      handleSendWithMessage(msg);
    }
  }, [initialMessage, handleSendWithMessage, isLoadingAuth]);

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="mt-3 text-sm text-[var(--foreground)]/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Short contained nav */}
      <header className="flex shrink-0 justify-center px-4 py-3">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background)]/70 px-4 py-2 backdrop-blur-md">
        {isSignedIn ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((o) => !o)}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        <BrokenCubeLogo href="/" size="md" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="shrink-0 gap-2 rounded-full border-[var(--border)]"
            title="Search chats (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          {isSignedIn ? (
            <>
              <Link href="/connectors">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-[var(--border)]"
                  title="Connect apps"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[var(--border)]"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
        </div>
      </header>

      <ChatSearchPopup
        open={searchOpen}
        onClose={() => { setSearchOpen(false); setSearchQuery(""); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userId={userId}
        onSelectMatch={handleSelectSearchMatch}
        localMatches={localMatches}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {isSignedIn && (
          <div
            className={`
              absolute left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-hidden
              rounded-r-2xl
              bg-[var(--background)]/50 backdrop-blur-md
              transition-[transform,width] duration-300 ease-out will-change-transform
              md:relative md:top-0 md:z-auto
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"}
            `}
            style={{
              ...(!sidebarOpen ? { pointerEvents: "none" as const } : {}),
              isolation: "isolate",
            }}
          >
            <ChatHistory
              conversations={conversations}
              activeId={activeConversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewChat}
              onDelete={handleDeleteConversation}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          {!chatMessages.length && !messages?.length ? (
            <div className="flex flex-1 flex-col w-full min-w-0 items-stretch justify-center px-4 pb-8">
              <div className="mx-auto w-full max-w-2xl flex flex-col items-stretch gap-12">
                <h1 className="text-center font-serif text-4xl font-normal uppercase tracking-tight text-[var(--foreground)] drop-shadow-sm md:text-5xl">
                  ASK ORBI!
                </h1>
                <div className="flex w-full flex-col items-stretch gap-5 rounded-3xl border border-[var(--border)]/60 bg-[var(--card)]/50 p-6 shadow-lg shadow-black/5 backdrop-blur-sm">
                  <ChatBar
                    input={input}
                    onInputChange={setInput}
                    onSubmit={handleSend}
                    onStop={stopGeneration}
                    isLoading={isLoading}
                    embedded
                  />
                  <div className="flex justify-center pt-1">
                  {isSignedIn ? (
                    <Link href="/connectors">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-md hover:bg-[var(--muted)]/50"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Connect apps
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/sign-in">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-md hover:bg-[var(--muted)]/50"
                      >
                        Sign in to connect apps
                      </Button>
                    </Link>
                  )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-2xl px-4 py-6">
                  {chatMessages.length > 0 &&
                    chatMessages.map((m) => {
                        const text =
                          "parts" in m &&
                          Array.isArray((m as { parts?: unknown[] }).parts)
                            ? (m as {
                                parts: Array<{ type: string; text?: string }>;
                              }).parts
                                .filter((p) => p.type === "text")
                                .map((p) => p.text ?? "")
                                .join("")
                            : String((m as { content?: string }).content ?? "");
                        const isLastAssistant =
                          m.role === "assistant" &&
                          m.id === chatMessages[chatMessages.length - 1]?.id;
                        return (
                          <ChatMessage
                            key={m.id}
                            role={m.role as "user" | "assistant"}
                            content={text}
                            isStreaming={isLoading && isLastAssistant}
                            searchHighlight={searchHighlight || undefined}
                          />
                        );
                      })}
                  {messages &&
                    chatMessages.length === 0 &&
                    messages
                      .filter((m) => m.role !== "system")
                      .map((m) => (
                        <ChatMessage
                          key={m._id}
                          role={m.role as "user" | "assistant"}
                          content={m.content}
                          searchHighlight={searchHighlight || undefined}
                        />
                      ))}
                  {isLoading && !chatMessages.some((m) => m.role === "assistant") && (
                    <div className="flex py-3">
                      <div className="flex items-center gap-1.5 rounded-3xl bg-[var(--assistant-bg)] border border-[var(--border)] px-4 py-3">
                        <span className="text-xs font-medium text-[var(--foreground)]/60">ORBI</span>
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full border-t border-[var(--border)]">
                <ChatBar
                  input={input}
                  onInputChange={setInput}
                  onSubmit={handleSend}
                  onStop={stopGeneration}
                  isLoading={isLoading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
