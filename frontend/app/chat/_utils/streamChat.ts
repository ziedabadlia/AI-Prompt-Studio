import type { ChatMessage, ChatSettings, StreamEnvelope } from "./types";

export async function streamChat(
  messages: ChatMessage[],
  settings: ChatSettings,
  onChunk: (content: string) => void,
  onFinal: (final: Extract<StreamEnvelope, { type: "final" }>) => void,
  onError: (err: Extract<StreamEnvelope, { type: "error" }>) => void,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        system_prompt: settings.systemPrompt,
        temperature: settings.temperature,
        model_name: settings.modelName,
      }),
    },
  );

  if (!response.body) {
    onError({
      type: "error",
      message: "No response body from server",
      status_code: 500,
    });
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let delimiterIndex: number;
    while ((delimiterIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawMessage = buffer.slice(0, delimiterIndex);
      buffer = buffer.slice(delimiterIndex + 2);

      if (!rawMessage.startsWith("data: ")) continue;

      const jsonPart = rawMessage.replace("data: ", "");
      if (!jsonPart.trim()) continue;

      const envelope: StreamEnvelope = JSON.parse(jsonPart);

      switch (envelope.type) {
        case "chunk":
          onChunk(envelope.content);
          break;
        case "final":
          onFinal(envelope);
          break;
        case "error":
          onError(envelope);
          break;
      }
    }
  }
}
