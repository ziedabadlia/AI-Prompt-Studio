import { useEffect, useRef } from "react";
import type { ChatMessage } from "../_utils/types";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  streamingContent: string;
  isStreaming: boolean;
  error: string | null;
};

export function MessageList({
  messages,
  streamingContent,
  isStreaming,
  error,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div className='flex-1 space-y-5 overflow-y-auto bg-[var(--background)] px-6 py-8'>
      {messages.length === 0 && !isStreaming && (
        <div className='flex h-full items-center justify-center'>
          <p className='text-sm text-[var(--text-secondary)]'>
            Start a conversation below.
          </p>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} {...msg} />
      ))}

      {streamingContent && (
        <div className='flex gap-3'>
          <span className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white'>
            AI
          </span>
          <p className='flex-1 whitespace-pre-wrap pt-1 text-[15px] leading-relaxed text-[var(--foreground)]'>
            {streamingContent}
            <span className='ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-[var(--accent)]' />
          </p>
        </div>
      )}

      {isStreaming && !streamingContent && (
        <div className='flex gap-3'>
          <span className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white'>
            AI
          </span>
          <div className='flex items-center gap-1 pt-3'>
            <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-secondary)] [animation-delay:-0.3s]' />
            <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-secondary)] [animation-delay:-0.15s]' />
            <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--text-secondary)]' />
          </div>
        </div>
      )}

      {error && (
        <div className='rounded-xl border border-[var(--error)]/20 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]'>
          {error}
        </div>
      )}

      {/* Sentinel element — scrolled into view on every update */}
      <div ref={bottomRef} />
    </div>
  );
}
