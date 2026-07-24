from pydantic import BaseModel

class LLMResponse(BaseModel):
    content: str
    input_tokens: int
    output_tokens: int