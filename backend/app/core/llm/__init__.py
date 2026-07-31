from app.llm.factory import get_llm
from app.llm.gemini import GeminiLLM
from app.core.config import settings


def ask_llm(prompt: str) -> str:
    try:
        llm = get_llm()
        return llm.generate(prompt)
    except Exception as e:
        if settings.LLM_PROVIDER.lower() == "groq":
            print(f"Primary provider Groq failed ({e}). Falling back to Gemini.")
            gemini_llm = GeminiLLM()
            return gemini_llm.generate(prompt)
        raise e


ask_gemini = ask_llm
__all__ = ["ask_llm", "ask_gemini"]
