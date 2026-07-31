"use client";

import { useState } from "react";
import { useChatStream } from "../_hooks/useChatStream";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { ChatSettings } from "./ChatSettings";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const {
    messages,
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    settings,
    setSettings,
  } = useChatStream();

  function handleSend() {
    sendMessage(input);
    setInput("");
  }

  return (
    <div className='flex h-screen bg-[var(--background)]'>
      {/* Main chat column */}
      <div className='flex h-full flex-1 flex-col'>
        <ChatHeader onToggleSettings={() => setIsPanelOpen((open) => !open)} />
        <MessageList
          messages={messages}
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

      {/* Fixed sidebar on large screens */}
      <div className='hidden w-80 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] lg:block'>
        <ChatSettings settings={settings} onChange={setSettings} />
      </div>

      {/* Drawer overlay on small screens */}
      {isPanelOpen && (
        <div className='fixed inset-0 z-50 flex lg:hidden'>
          <div
            className='flex-1 bg-black/30'
            onClick={() => setIsPanelOpen(false)}
          />
          <div className='w-80 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] shadow-xl'>
            <ChatSettings settings={settings} onChange={setSettings} />
          </div>
        </div>
      )}
    </div>
  );
}
