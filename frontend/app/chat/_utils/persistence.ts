import type { Conversation, PromptTemplate } from "./types";

const CONVERSATIONS_KEY = "ai-prompt-studio:conversations";
const ACTIVE_ID_KEY = "ai-prompt-studio:active-id";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CONVERSATIONS_KEY,
      JSON.stringify(conversations),
    );
  } catch {
    // quota exceeded etc — persistence is best-effort
  }
}

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id === null) window.localStorage.removeItem(ACTIVE_ID_KEY);
  else window.localStorage.setItem(ACTIVE_ID_KEY, id);
}

const PROMPT_TEMPLATES_KEY = "ai-prompt-studio:prompt-templates";

export function loadUserPromptTemplates(): PromptTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROMPT_TEMPLATES_KEY);
    return raw ? (JSON.parse(raw) as PromptTemplate[]) : [];
  } catch {
    return [];
  }
}

export function saveUserPromptTemplates(templates: PromptTemplate[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PROMPT_TEMPLATES_KEY,
      JSON.stringify(templates),
    );
  } catch {}
}
