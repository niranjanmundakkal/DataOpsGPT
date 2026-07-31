from app.core.config import settings

from app.llm.gemini import GeminiLLM
from app.llm.groq import GroqLLM


def get_llm():

    provider = settings.LLM_PROVIDER.lower()

    if provider == "groq":
        return GroqLLM()

    return GeminiLLM()
