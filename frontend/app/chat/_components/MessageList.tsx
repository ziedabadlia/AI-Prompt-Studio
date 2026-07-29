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
  return (
    <div className='flex-1 overflow-y-auto px-4 py-6 space-y-4'>
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}

      {streamingContent && (
        <MessageBubble role='assistant' content={streamingContent} />
      )}

      {isStreaming && !streamingContent && (
        <div className='flex justify-start'>
          <div className='rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-2 text-sm text-gray-400'>
            Thinking…
          </div>
        </div>
      )}

      {error && (
        <div className='flex justify-start'>
          <div className='rounded-2xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700'>
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
