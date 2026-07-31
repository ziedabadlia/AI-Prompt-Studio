type ChatHeaderProps = {
  onToggleSettings: () => void;
};

export function ChatHeader({ onToggleSettings }: ChatHeaderProps) {
  return (
    <div className='flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4'>
      <div className='flex items-center gap-2.5'>
        <span
          className='font-fraunces flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white'
        >
          P
        </span>
        <span
          className='font-fraunces text-[15px] font-medium text-[var(--foreground)]'
        >
          Prompt Studio
        </span>
      </div>

      <div className='flex items-center gap-3'>
        <span className='rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent-dim)]'>
          gemini-3.5-flash-lite
        </span>
        <button
          onClick={onToggleSettings}
          aria-label='Toggle settings'
          className='flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-dim)] lg:hidden'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='3' />
            <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' />
          </svg>
        </button>
      </div>
    </div>
  );
}
