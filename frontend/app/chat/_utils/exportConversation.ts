import type { Conversation } from "./types";
import { MODEL_LABELS } from "./types";

export type ExportFormat = "markdown" | "json" | "text";

function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString();
}

function sanitizeFilename(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "conversation"
  );
}

export function conversationToMarkdown(conversation: Conversation): string {
  const lines: string[] = [];
  lines.push(`# ${conversation.title}`);
  lines.push("");
  lines.push(`- Exported: ${formatTimestamp(Date.now())}`);
  lines.push(`- Created: ${formatTimestamp(conversation.createdAt)}`);
  lines.push(`- Model: ${MODEL_LABELS[conversation.settings.modelName]}`);
  lines.push(`- Temperature: ${conversation.settings.temperature}`);
  if (conversation.settings.systemPrompt.trim()) {
    lines.push("");
    lines.push("## System prompt");
    lines.push("");
    lines.push("```");
    lines.push(conversation.settings.systemPrompt.trim());
    lines.push("```");
  }
  lines.push("");
  lines.push("## Conversation");

  for (const message of conversation.messages) {
    const speaker = message.role === "user" ? "User" : "Assistant";
    lines.push("");
    lines.push(`### ${speaker}`);
    lines.push("");
    lines.push(message.content);
    if (
      message.role === "assistant" &&
      message.inputTokens !== undefined &&
      message.outputTokens !== undefined
    ) {
      lines.push("");
      lines.push(
        `*${message.inputTokens} input tokens, ${message.outputTokens} output tokens*`,
      );
    }
  }

  return lines.join("\n");
}

export function conversationToJson(conversation: Conversation): string {
  return JSON.stringify(conversation, null, 2);
}

export function conversationToPlainText(conversation: Conversation): string {
  const lines: string[] = [];
  lines.push(conversation.title);
  lines.push(`Exported: ${formatTimestamp(Date.now())}`);
  lines.push("");

  for (const message of conversation.messages) {
    const speaker = message.role === "user" ? "User" : "Assistant";
    lines.push(`${speaker}:`);
    lines.push(message.content);
    lines.push("");
  }

  return lines.join("\n");
}

const EXTENSION_BY_FORMAT: Record<ExportFormat, string> = {
  markdown: "md",
  json: "json",
  text: "txt",
};

const MIME_BY_FORMAT: Record<ExportFormat, string> = {
  markdown: "text/markdown",
  json: "application/json",
  text: "text/plain",
};

function serializeConversation(
  conversation: Conversation,
  format: ExportFormat,
): string {
  switch (format) {
    case "markdown":
      return conversationToMarkdown(conversation);
    case "json":
      return conversationToJson(conversation);
    case "text":
      return conversationToPlainText(conversation);
  }
}

export function downloadConversation(
  conversation: Conversation,
  format: ExportFormat,
): void {
  const content = serializeConversation(conversation, format);
  const mimeType = MIME_BY_FORMAT[format];
  const extension = EXTENSION_BY_FORMAT[format];
  const filename = `${sanitizeFilename(conversation.title)}.${extension}`;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
