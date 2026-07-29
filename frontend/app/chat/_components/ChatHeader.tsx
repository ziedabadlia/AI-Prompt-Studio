export function ChatHeader() {
  return (
    <div className='flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4'>
      <div className='flex items-center gap-2.5'>
        <span
          className='flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white'
          style={{ fontFamily: "var(--font-display)" }}
        >
          P
        </span>
        <span
          className='text-[15px] font-medium text-[var(--foreground)]'
          style={{ fontFamily: "var(--font-display)" }}
        >
          Prompt Studio
        </span>
      </div>
      <span className='rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-[var(--accent-dim)]'>
        gemini-3.5-flash-lite
      </span>
    </div>
  );
}
