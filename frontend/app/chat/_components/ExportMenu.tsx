"use client";

import { useEffect, useRef, useState } from "react";
import type { Conversation } from "../_utils/types";
import {
  downloadConversation,
  type ExportFormat,
} from "../_utils/exportConversation";

type ExportMenuProps = {
  conversation: Conversation | null;
};

const FORMAT_OPTIONS: { format: ExportFormat; label: string }[] = [
  { format: "markdown", label: "Markdown (.md)" },
  { format: "json", label: "JSON (.json)" },
  { format: "text", label: "Plain text (.txt)" },
];

export function ExportMenu({ conversation }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const disabled = !conversation || conversation.messages.length === 0;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleExport(format: ExportFormat) {
    if (!conversation) return;
    downloadConversation(conversation, format);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        aria-label='Export conversation'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        className='flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
          <polyline points='7 10 12 15 17 10' />
          <line x1='12' y1='15' x2='12' y2='3' />
        </svg>
      </button>

      {isOpen && (
        <div
          role='menu'
          className='absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg'
        >
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.format}
              role='menuitem'
              onClick={() => handleExport(option.format)}
              className='block w-full px-3.5 py-2 text-left text-sm text-[var(--foreground)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent-dim)]'
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
