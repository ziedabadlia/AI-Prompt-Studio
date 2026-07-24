from typing import Protocol, List
from app.models.message import Message
from app.models.llm_response import LLMResponse

class LLMClient(Protocol):
    def chat(
        self,
        system_prompt: str,
        messages: List[Message],
        temperature: float,
    ) -> LLMResponse:
        ...