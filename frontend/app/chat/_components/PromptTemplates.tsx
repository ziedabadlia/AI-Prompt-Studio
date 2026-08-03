"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePromptTemplates } from "../_hooks/usePromptTemplates";

type PromptTemplatesProps = {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
};

export function PromptTemplates({
  systemPrompt,
  onSystemPromptChange,
}: PromptTemplatesProps) {
  const { allTemplates, saveTemplate, deleteTemplate } = usePromptTemplates();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selected = selectedId
    ? (allTemplates.find((t) => t.id === selectedId) ?? null)
    : null;
  const isEditingUserTemplate = selected !== null && !selected.isBuiltIn;

  function handleSelectCard(id: string) {
    // Clicking the already-selected card toggles it off, back to blank state.
    if (id === selectedId) {
      resetToBlank();
      return;
    }
    const template = allTemplates.find((t) => t.id === id);
    if (!template) return;
    setSelectedId(id);
    setTitle(template.name);
    onSystemPromptChange(template.content);
    setError(null);
  }

  function resetToBlank() {
    setSelectedId(null);
    setTitle("");
    onSystemPromptChange("");
    setError(null);
  }

  function handleSave() {
    const editingId = isEditingUserTemplate ? selectedId : null;
    const result = saveTemplate(title, systemPrompt, editingId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Saved successfully: deselect and clear back to a blank slate,
    // rather than leaving the just-saved template "stuck" as selected.
    resetToBlank();
  }

  function handleDelete() {
    if (!selectedId) return;
    deleteTemplate(selectedId);
    resetToBlank();
  }

  // Dirty check: Save only shows when the current title/content actually
  // differs from whatever is selected (or, if nothing is selected, when
  // there's any content at all — since there's nothing to "match" yet).
  const isDirty = selected
    ? title !== selected.name || systemPrompt !== selected.content
    : title.trim().length > 0 || systemPrompt.trim().length > 0;

  return (
    <div className='flex flex-col gap-3'>
      {}
      <div className='flex flex-wrap gap-2'>
        {allTemplates.map((t) => (
          <TemplateCard
            key={t.id}
            name={t.name}
            isActive={t.id === selectedId}
            onClick={() => handleSelectCard(t.id)}
          />
        ))}
      </div>

      {}
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='template-title'>Template title</Label>
        <input
          id='template-title'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder='e.g. Strict Code Reviewer'
          className='w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
        />
      </div>

      {}
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='system-prompt'>System prompt</Label>
        <Textarea
          id='system-prompt'
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder='e.g. You are a concise, technical assistant.'
          className='min-h-[120px] flex-1 resize-none'
        />
      </div>

      {error && <p className='text-xs text-[var(--error)]'>{error}</p>}

      {}
      <div className='flex gap-2'>
        {isDirty && (
          <Button size='sm' onClick={handleSave}>
            Save
          </Button>
        )}
        {isEditingUserTemplate && (
          <Button size='sm' variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

function TemplateCard({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const [truncated, setTruncated] = useState(false);

  return (
    <div className='group relative'>
      <button
        onClick={onClick}
        className={cn(
          "max-w-[140px] truncate rounded-lg border px-3 py-2 text-left text-xs font-medium transition",
          isActive
            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-dim)]"
            : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
        )}
        ref={(el) => {
          if (el) setTruncated(el.scrollWidth > el.clientWidth);
        }}
      >
        {name}
      </button>
      {truncated && (
        <div
          role='tooltip'
          className='pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-max max-w-[220px] -translate-x-1/2 scale-95 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--foreground)] opacity-0 shadow-md transition-all duration-150 group-hover:scale-100 group-hover:opacity-100'
        >
          {name}
          <div className='absolute top-full left-1/2 -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-[var(--border)] bg-[var(--surface)]' />
        </div>
      )}
    </div>
  );
}
