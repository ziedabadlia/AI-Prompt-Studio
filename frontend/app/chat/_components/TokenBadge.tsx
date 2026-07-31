import { TOKEN_THRESHOLD_HIGH, TOKEN_THRESHOLD_LOW } from "../_utils/types";

type TokenBadgeProps = {
  inputTokens: number;
  outputTokens: number;
};

export function TokenBadge({ inputTokens, outputTokens }: TokenBadgeProps) {
  const total = inputTokens + outputTokens;

  if (total < TOKEN_THRESHOLD_LOW) {
    return (
      <span className='inline-flex w-fit items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--accent-dim)]'>
        <LeafIcon />
        {total} tokens
      </span>
    );
  }

  if (total <= TOKEN_THRESHOLD_HIGH) {
    return (
      <span className='inline-flex w-fit items-center gap-1 rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-secondary)]'>
        {total} tokens
      </span>
    );
  }

  return (
    <span className='inline-flex w-fit items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700'>
      <WarningIcon />
      {total} tokens
    </span>
  );
}

function LeafIcon() {
  return (
    <svg
      width='11'
      height='11'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 1 5.7 1 8-1 8-6.3 10-9 10-2 0-2.5-2-2.5-2z' />
      <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width='11'
      height='11'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
      <line x1='12' y1='9' x2='12' y2='13' />
      <line x1='12' y1='17' x2='12.01' y2='17' />
    </svg>
  );
}
