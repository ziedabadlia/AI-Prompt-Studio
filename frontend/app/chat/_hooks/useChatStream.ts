import { useState, useRef } from "react";
import { streamChat } from "../_utils/streamChat";
import type { ChatMessage, ChatSettings } from "../_utils/types";

interface UseChatStreamArgs {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  settings: ChatSettings;
  setSettings: (settings: ChatSettings) => void;
  onFirstExchangeComplete?: (
    userMessage: string,
    assistantMessage: string,
  ) => void;
}

export function useChatStream({
  messages,
  setMessages,
  settings,
  setSettings,
  onFirstExchangeComplete,
}: UseChatStreamArgs) {
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref so the callback always uses the latest render's values
  // (e.g. conv.activeId after ensureActiveConversationWithMessages has fired).
  const onFirstExchangeCompleteRef = useRef(onFirstExchangeComplete);
  onFirstExchangeCompleteRef.current = onFirstExchangeComplete;

  async function sendMessage(userInput: string) {
    const trimmed = userInput.trim();
    if (!trimmed || isStreaming) return;

    const isFirstMessage = messages.length === 0;

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
        (chunk) => setStreamingContent((prev) => prev + chunk),
        (final) => {
          const updated = [
            ...nextMessages,
            {
              role: "assistant" as const,
              content: final.content,
              inputTokens: final.input_tokens,
              outputTokens: final.output_tokens,
              modelName: settings.modelName,
            },
          ];
          setMessages(updated);
          setStreamingContent("");
          setIsStreaming(false);

          if (isFirstMessage) {
            onFirstExchangeCompleteRef.current?.(trimmed, final.content);
          }
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
    streamingContent,
    isStreaming,
    error,
    sendMessage,
  };
}
