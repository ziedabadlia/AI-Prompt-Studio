import { useState } from "react";
import { streamChat } from "../_utils/streamChat";
import type { ChatMessage, ChatSettings } from "../_utils/types";
import { DEFAULT_CHAT_SETTINGS } from "../_utils/types";

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_CHAT_SETTINGS);

  async function sendMessage(userInput: string) {
    const trimmed = userInput.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setError(null);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      await streamChat(
        nextMessages,
        settings,
        (chunk) => {
          setStreamingContent((prev) => prev + chunk);
        },
        (final) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: final.content },
          ]);
          setStreamingContent("");
          setIsStreaming(false);
        },
        (err) => {
          setError(err.message);
          setStreamingContent("");
          setIsStreaming(false);
        },
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong while streaming.",
      );
      setStreamingContent("");
      setIsStreaming(false);
    }
  }

  return {
    messages,
    streamingContent,
    isStreaming,
    error,
    sendMessage,
    settings,
    setSettings,
  };
}
