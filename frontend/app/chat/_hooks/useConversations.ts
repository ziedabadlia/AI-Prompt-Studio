import { useState, useEffect, useCallback } from "react";
import type { ChatMessage, ChatSettings, Conversation } from "../_utils/types";
import { loadConversations, saveConversations } from "../_utils/persistence";
import { DEFAULT_CHAT_SETTINGS } from "../_utils/types";
import { generateTitle as callTitleApi } from "../_utils/titleGeneration";

function deriveTitle(firstMessageContent: string): string {
  const trimmed = firstMessageContent.trim();
  if (!trimmed) return "New conversation";
  return trimmed.length > 40 ? trimmed.slice(0, 40) + "…" : trimmed;
}

export function useConversations(initialActiveId?: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  // Seed from the URL-supplied ID; hook doesn't manage URL itself.
  const [activeId, setActiveId] = useState<string | null>(
    initialActiveId ?? null,
  );
  const [hydrated, setHydrated] = useState(false);

  const updateTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  const generateTitle = useCallback(
    async (id: string, userMessage: string, assistantMessage: string) => {
      const title = await callTitleApi(userMessage, assistantMessage);
      if (title) updateTitle(id, title);
      // if null, the derived-from-first-message title (already set) just stays
    },
    [updateTitle],
  );

  useEffect(() => {
    const loaded = loadConversations();
    setConversations(loaded);
    // If the URL-supplied ID doesn't exist in storage, fall back to null.
    setActiveId((prev) => {
      if (prev && loaded.some((c) => c.id === prev)) return prev;
      return null;
    });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveConversations(conversations);
  }, [hydrated, conversations]);
  // activeId is persisted via URL (managed by ChatContainer) — no localStorage.

  const active = conversations.find((c) => c.id === activeId) ?? null;

  // Auto-create-on-first-message: called right before the first send
  const ensureActiveConversation = useCallback(
    (firstMessageContent: string): string => {
      if (activeId && conversations.some((c) => c.id === activeId))
        return activeId;

      const id = crypto.randomUUID();
      const created: Conversation = {
        id,
        title: deriveTitle(firstMessageContent),
        createdAt: Date.now(),
        messages: [],
        settings: DEFAULT_CHAT_SETTINGS,
      };
      setConversations((prev) => [created, ...prev]);
      setActiveId(id);
      return id;
    },
    [activeId, conversations],
  );

  const updateMessages = useCallback((id: string, messages: ChatMessage[]) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, messages } : c)),
    );
  }, []);

  const updateSettings = useCallback((id: string, settings: ChatSettings) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, settings } : c)),
    );
  }, []);

  const startNewConversation = useCallback(() => setActiveId(null), []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  return {
    conversations,
    activeId,
    active,
    hydrated,
    selectConversation: setActiveId,
    startNewConversation,
    deleteConversation,
    ensureActiveConversation,
    updateMessages,
    updateSettings,
    generateTitle,
    _setActiveId: setActiveId,
  };
}
