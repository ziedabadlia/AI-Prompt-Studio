import { cn } from "@/lib/utils";
import type { Conversation } from "../_utils/types";
import { useTypewriter } from "../_hooks/useTypewriter";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

// ─── Single conversation item ───────────────────────────────────────────────

interface ItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ItemProps) {
  const { displayed, isTyping } = useTypewriter(conversation.title);

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-[var(--accent-soft)] text-[var(--accent-dim)] font-medium"
          : "text-[var(--foreground)] hover:bg-[var(--border)]",
      )}
    >
      <span className='min-w-0 flex-1 truncate'>
        {displayed}
        {/* Blinking caret while typing, just like ChatGPT */}
        {isTyping && (
          <span className='ml-px inline-block h-[0.85em] w-[2px] translate-y-[1px] animate-pulse rounded-sm bg-current align-middle' />
        )}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(conversation.id);
        }}
        aria-label='Delete conversation'
        className={cn(
          "shrink-0 rounded p-0.5 text-[var(--text-secondary)] transition-opacity hover:text-[var(--error)]",
          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          isActive && "opacity-100",
        )}
      >
        <svg
          width='13'
          height='13'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='3 6 5 6 21 6' />
          <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' />
          <path d='M10 11v6' />
          <path d='M14 11v6' />
          <path d='M9 6V4h6v2' />
        </svg>
      </button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <div className='flex h-full flex-col'>
      {/* Header / New chat button */}
      <div className='border-b border-[var(--border)] p-3'>
        <button
          onClick={onNew}
          className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-dim)] hover:border-[var(--accent-soft)]'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 5v14M5 12h14' />
          </svg>
          New chat
        </button>
      </div>

      {/* Conversation list */}
      <div className='flex flex-col gap-0.5 overflow-y-auto p-2'>
        {conversations.length === 0 && (
          <p className='px-3 py-4 text-center text-xs text-[var(--text-secondary)]'>
            No conversations yet
          </p>
        )}
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            isActive={c.id === activeId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
