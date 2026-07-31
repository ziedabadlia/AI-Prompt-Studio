export async function generateTitle(
  userMessage: string,
  assistantMessage: string,
): Promise<string | null> {
  // Gemini rejects conversations ending with a model turn, so we embed
  // both turns in a single user message and ask for a title directly.
  const prompt =
    `User: ${userMessage}\n` +
    `Assistant: ${assistantMessage}\n\n` +
    `Generate a short title (3-6 words) summarizing this conversation. ` +
    `Reply with ONLY the title — no quotes, no punctuation at the end.`;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          model_name: "gemini-3.5-flash-lite",
        }),
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    return (data.content as string)?.trim() || null;
  } catch {
    return null;
  }
}
