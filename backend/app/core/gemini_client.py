from app.core.exceptions import LLMProviderError
from app.core.llm_client import LLMClient 
from app.models.message import Message
from app.models.llm_response import LLMResponse
from google import genai
from google.genai import types
from google.genai import errors


def _to_gemini_content(msg: Message):
    ROLE_MAP = {"user": "user", "assistant": "model"}
    gemini_role = ROLE_MAP[msg.role]
    return types.Content(role=gemini_role, parts=[types.Part(text=msg.content)])


def _to_gemini_contents(messages: list[Message]):
    return [_to_gemini_content(msg) for msg in messages]



class GeminiClient:
    def __init__(self, client: genai.Client, model_name: str):
        self.client = client
        self.model_name = model_name

    def chat(self, system_prompt: str, messages: list[Message], temperature: float) -> LLMResponse:
        contents = _to_gemini_contents(messages)
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=types.GenerateContentConfig(system_instruction=system_prompt,temperature=temperature)
            )
        except errors.APIError as e:
            raise LLMProviderError(str(e.message),e.code)
        return LLMResponse(
            content=response.text,
            input_tokens=response.usage_metadata.prompt_token_count,
            output_tokens=response.usage_metadata.candidates_token_count,
        )

    def chat_stream(self, system_prompt: str, messages: list[Message], temperature: float):
        contents = _to_gemini_contents(messages)
        stream = self.client.models.generate_content_stream(
            model=self.model_name,
            contents=contents,
            config=types.GenerateContentConfig(system_instruction=system_prompt, temperature=temperature),
        )
        accumulated_text = ""
        chunk = None

        try:
            for chunk in stream:
                accumulated_text += chunk.text
                yield chunk.text
        except errors.APIError as e:
            raise LLMProviderError(str(e.message), e.code)

        if chunk is None:
            raise LLMProviderError("Empty stream", 400)

        yield LLMResponse(
            content=accumulated_text,
            input_tokens=chunk.usage_metadata.prompt_token_count,
            output_tokens=chunk.usage_metadata.candidates_token_count,
        )