export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  inputTokens?: number;
  outputTokens?: number;
};

export type StreamEnvelope =
  | { type: "chunk"; content: string }
  | {
      type: "final";
      content: string;
      input_tokens: number;
      output_tokens: number;
    }
  | { type: "error"; message: string; status_code: number };

export type ModelName = "gemini-3.5-flash" | "gemini-3.5-flash-lite";

export type ChatSettings = {
  systemPrompt: string;
  temperature: number;
  modelName: ModelName;
};

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  systemPrompt: "",
  temperature: 0.7,
  modelName: "gemini-3.5-flash-lite",
};

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
  settings: ChatSettings;
}

export type PromptTemplate = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  isBuiltIn: boolean;
};

export const TOKEN_THRESHOLD_LOW = 200;
export const TOKEN_THRESHOLD_HIGH = 800;
