"use client";

import { useState } from "react";
import { useChatStream } from "../_hooks/useChatStream";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatContainer() {
  const [input, setInput] = useState("");
  const { messages, streamingContent, isStreaming, error, sendMessage } =
    useChatStream();

  function handleSend() {
    sendMessage(input);
    setInput("");
  }

  return (
    <div className='flex flex-col h-screen max-w-3xl mx-auto bg-white'>
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
  );
}
