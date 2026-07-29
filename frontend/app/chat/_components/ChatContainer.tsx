"use client";

import { useState } from "react";
import { useChatStream } from "../_hooks/useChatStream";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const { messages, streamingContent, isStreaming, error, sendMessage } =
    useChatStream();

  function handleSend() {
    sendMessage(input);
    setInput("");
  }

  return (
    <div className='flex h-screen justify-center bg-[var(--background)]'>
      <div className='flex h-full w-full max-w-3xl flex-col'>
        <ChatHeader />
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
    </div>
  );
}
