import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.core.exceptions import LLMProviderError
from app.schemas.chat import ChatRequest
from app.models.llm_response import LLMResponse
from app.services.chat_service import handle_chat, handle_chat_stream

router = APIRouter()

@router.post("/chat", response_model=LLMResponse)
def chat(request: ChatRequest) -> LLMResponse:
    try:
        return handle_chat(request)
    except LLMProviderError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/chat/stream")
def chat_stream_endpoint(request: ChatRequest):
    def event_generator():
        try:
            for chunk in handle_chat_stream(request):
                if isinstance(chunk, str):
                    envelope = {"type": "chunk", "content": chunk}
                else:
                    envelope = {
                        "type": "final",
                        "content": chunk.content,
                        "input_tokens": chunk.input_tokens,
                        "output_tokens": chunk.output_tokens,
                    }
                yield f"data: {json.dumps(envelope)}\n\n"
        except LLMProviderError as e:
            envelope = {"type": "error", "message": e.message, "status_code": e.status_code}
            yield f"data: {json.dumps(envelope)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")