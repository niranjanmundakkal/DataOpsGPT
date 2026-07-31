from functools import lru_cache
from app.core.config import settings
from app.core.llm.base import LLMProvider


@lru_cache(maxsize=8)
def _get_provider(provider_name: str) -> LLMProvider:
    """Return a provider instance for the requested name."""
    provider = provider_name.lower()

    if provider == "groq":
        from app.core.llm.groq_provider import GroqProvider
        return GroqProvider()

    if provider == "gemini":
        from app.core.llm.gemini import GeminiProvider
        return GeminiProvider()

    raise ValueError(
        f"Unknown LLM_PROVIDER '{provider_name}'. Supported: 'groq', 'gemini'"
    )


def get_provider(provider_name: str | None = None) -> LLMProvider:
    """Return the configured LLM provider (singleton per provider name)."""
    name = (provider_name or settings.LLM_PROVIDER).lower()
    return _get_provider(name)
