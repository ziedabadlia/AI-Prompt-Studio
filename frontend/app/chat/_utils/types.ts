export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
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
