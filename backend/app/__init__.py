from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="AI Prompt Studio",
        description="Backend API for AI Prompt Studio — test and compare LLM prompts.",
        version="0.1.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(chat_router, prefix="/api/v1")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app

app = create_app()