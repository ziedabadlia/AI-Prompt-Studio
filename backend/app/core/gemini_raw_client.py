from google import genai
from app.config.settings import settings

raw_gemini_client = genai.Client(api_key=settings.gemini_api_key)