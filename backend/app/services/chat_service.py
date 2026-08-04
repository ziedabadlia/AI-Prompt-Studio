from app.models.llm_response import LLMResponse
from app.core.gemini_raw_client import raw_gemini_client
from app.core.gemini_client import GeminiClient
from app.schemas.chat import ChatRequest


def _build_gemini_client(request: ChatRequest) -> GeminiClient:
    return GeminiClient(client=raw_gemini_client, model_name=request.model_name)

def handle_chat(request: ChatRequest) -> LLMResponse:
    client = _build_gemini_client(request)
    return client.chat(
        system_prompt=request.system_prompt,
        messages=request.messages,
        temperature=request.temperature,
    )

def handle_chat_stream(request: ChatRequest):
    client = _build_gemini_client(request)
    return client.chat_stream(
        system_prompt=request.system_prompt,
        messages=request.messages,
        temperature=request.temperature,
    )