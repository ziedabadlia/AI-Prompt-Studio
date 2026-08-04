"use client";

import { useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useChatStream } from "../_hooks/useChatStream";
import { useConversations } from "../_hooks/useConversations";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ChatSettings } from "./ChatSettings";
import { ConversationSidebar } from "./ConversationSidebar";
import { DEFAULT_CHAT_SETTINGS } from "../_utils/types";
import type { ChatSettings as ChatSettingsType } from "../_utils/types";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pendingSettings, setPendingSettings] =
    useState<ChatSettingsType | null>(null);

  const searchParams = useSearchParams();

  const conv = useConversations(searchParams.get("id"));
  const router = useRouter();
  const pathname = usePathname();

  const currentSettings =
    conv.active?.settings ?? pendingSettings ?? DEFAULT_CHAT_SETTINGS;

  const totalTokens = (conv.active?.messages ?? []).reduce(
    (sum, m) => sum + (m.inputTokens ?? 0) + (m.outputTokens ?? 0),
    0,
  );

  function handleSettingsChange(settings: ChatSettingsType) {
    if (conv.activeId) {
      conv.updateSettings(conv.activeId, settings);
    } else {
      setPendingSettings(settings);
    }
  }

  const syncUrl = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("id", id);
      else params.delete("id");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const selectConversation = useCallback(
    (id: string) => {
      conv._setActiveId(id);
      syncUrl(id);
    },
    [conv, syncUrl],
  );

  const startNewConversation = useCallback(() => {
    conv._setActiveId(null);
    syncUrl(null);
  }, [conv, syncUrl]);

  const targetConvIdRef = useRef<string | null>(null);

  const { streamingContent, isStreaming, error, sendMessage } = useChatStream({
    messages: conv.active?.messages ?? [],
    setMessages: (messages) => {
      const id = targetConvIdRef.current ?? conv.activeId;
      if (id) conv.updateMessages(id, messages);
    },
    settings: currentSettings,
    setSettings: (settings) => {
      if (conv.activeId) conv.updateSettings(conv.activeId, settings);
    },
    onFirstExchangeComplete: (userMessage, assistantMessage) => {
      const id = targetConvIdRef.current ?? conv.activeId;
      if (id) conv.generateTitle(id, userMessage, assistantMessage);
    },
  });

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    if (conv.activeId) {
      targetConvIdRef.current = conv.activeId;
    } else {
      const newId = conv.ensureActiveConversation(
        trimmed,
        pendingSettings ?? undefined,
      );
      targetConvIdRef.current = newId;
      setPendingSettings(null);
      syncUrl(newId);
    }

    sendMessage(trimmed);
    setInput("");
  }

  return (
    <div className='flex h-screen bg-[var(--background)]'>
      {/* Conversation sidebar, always visible on large screens */}
      <div className='hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:block'>
        <ConversationSidebar
          conversations={conv.conversations}
          activeId={conv.activeId}
          onSelect={selectConversation}
          onNew={startNewConversation}
          onDelete={conv.deleteConversation}
        />
      </div>

      {/* Main chat column */}
      <div className='flex h-full flex-1 flex-col'>
        <ChatHeader
          onToggleSettings={() => setIsPanelOpen((open) => !open)}
          totalTokens={totalTokens}
          modelName={currentSettings.modelName}
          conversation={conv.active}
        />
        <MessageList
          messages={conv.active?.messages ?? []}
          streamingContent={streamingContent}
          isStreaming={isStreaming}
          error={error}
        />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isStreaming}
        />
      </div>

      {/* Fixed settings sidebar on large screens */}
      <div className='hidden w-80 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] lg:block'>
        <ChatSettings
          settings={currentSettings}
          onChange={handleSettingsChange}
          modelLocked={isStreaming}
        />
      </div>

      {/* Drawer overlay on small screens */}
      {isPanelOpen && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          <div
            className='flex-1 bg-black/30'
            onClick={() => setIsPanelOpen(false)}
          />
          <div className='w-80 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] shadow-xl'>
            <ChatSettings
              settings={currentSettings}
              onChange={handleSettingsChange}
              modelLocked={isStreaming}
            />
          </div>
        </div>
      )}
    </div>
  );
}
