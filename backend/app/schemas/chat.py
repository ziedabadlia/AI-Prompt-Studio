from pydantic import BaseModel, Field
from typing import Literal, List
from app.models.message import Message

class ChatRequest(BaseModel):
    system_prompt: str = ""
    messages: List[Message]
    temperature: float = Field(ge=0.0, le=2.0, default=0.7)
    provider: Literal["gemini"] = "gemini"
    model_name: Literal["gemini-3.5-flash"] = "gemini-3.5-flash"