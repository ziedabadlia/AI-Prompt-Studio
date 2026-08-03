import { useState, useEffect, useCallback } from "react";
import type { PromptTemplate } from "../_utils/types";
import { BUILTIN_PROMPT_TEMPLATES } from "../_utils/promptTemplates";
import {
  loadUserPromptTemplates,
  saveUserPromptTemplates,
} from "../_utils/persistence";

export type SaveTemplateResult = { ok: true } | { ok: false; error: string };

export function usePromptTemplates() {
  const [userTemplates, setUserTemplates] = useState<PromptTemplate[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUserTemplates(loadUserPromptTemplates());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveUserPromptTemplates(userTemplates);
  }, [hydrated, userTemplates]);

  const allTemplates = [...BUILTIN_PROMPT_TEMPLATES, ...userTemplates];

  const saveTemplate = useCallback(
    (
      name: string,
      content: string,
      editingId: string | null,
    ): SaveTemplateResult => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return { ok: false, error: "Title cannot be empty." };
      }

      // editingId only counts as "editing" if it points at an existing USER template.
      const editingExisting = editingId
        ? (userTemplates.find((t) => t.id === editingId) ?? null)
        : null;

      const collision = allTemplates.find(
        (t) =>
          t.name.toLowerCase() === trimmedName.toLowerCase() &&
          t.id !== editingExisting?.id,
      );
      if (collision) {
        return {
          ok: false,
          error: "A template with this title already exists.",
        };
      }

      if (editingExisting) {
        setUserTemplates((prev) =>
          prev.map((t) =>
            t.id === editingExisting.id
              ? { ...t, name: trimmedName, content }
              : t,
          ),
        );
      } else {
        const created: PromptTemplate = {
          id: crypto.randomUUID(),
          name: trimmedName,
          content,
          createdAt: Date.now(),
          isBuiltIn: false,
        };
        setUserTemplates((prev) => [created, ...prev]);
      }

      return { ok: true };
    },
    [userTemplates, allTemplates],
  );

  const deleteTemplate = useCallback((id: string) => {
    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    allTemplates,
    saveTemplate,
    deleteTemplate,
  };
}
