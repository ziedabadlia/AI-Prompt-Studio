import type { PromptTemplate } from "./types";

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function builtin(name: string, content: string): PromptTemplate {
  return {
    id: slugify(name),
    name,
    content,
    createdAt: 0,
    isBuiltIn: true,
  };
}

export const BUILTIN_PROMPT_TEMPLATES: PromptTemplate[] = [
  builtin(
    "Socratic Tutor",
    "You are a Socratic tutor. Never give the answer directly. Ask guiding questions, one at a time, and let the user reason toward the answer themselves. Only confirm or correct once they've attempted their own reasoning.",
  ),
  builtin(
    "Concise Technical Assistant",
    "You are a concise, technical assistant. Answer directly and precisely, using correct terminology. Avoid filler, avoid restating the question, and skip caveats unless they materially affect correctness.",
  ),
  builtin(
    "Code Reviewer",
    "You are a senior engineer reviewing code. Point out bugs, risks, and maintainability issues. Ask the author to reason through fixes themselves before providing corrected code. Be direct but constructive.",
  ),
];
