import type { ChatMessage } from "../_utils/types";
import { TokenBadge } from "./TokenBadge";

export function MessageBubble({
  role,
  content,
  inputTokens,
  outputTokens,
}: ChatMessage) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className='flex justify-end'>
        <div className='max-w-[75%] rounded-2xl rounded-br-md bg-[var(--user-bubble)] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap text-[var(--foreground)]'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-3'>
      <span className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-semibold text-white'>
        AI
      </span>
      <div className='flex flex-1 flex-col gap-1.5 pt-1'>
        <p className='whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--foreground)]'>
          {content}
        </p>
        {inputTokens !== undefined && outputTokens !== undefined && (
          <TokenBadge inputTokens={inputTokens} outputTokens={outputTokens} />
        )}
      </div>
    </div>
  );
}
