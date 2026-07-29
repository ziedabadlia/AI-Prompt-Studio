type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
};

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className='border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4'>
      <div className='flex items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 shadow-sm transition focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent)]/15'>
        <textarea
          className='flex-1 resize-none bg-transparent py-1 text-[15px] text-[var(--foreground)] placeholder:text-[var(--text-secondary)] focus:outline-none'
          rows={1}
          placeholder='Message Prompt Studio...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className='mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition hover:bg-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-30'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 19V5M5 12l7-7 7 7' />
          </svg>
        </button>
      </div>
    </div>
  );
}
