from abc import ABC, abstractmethod


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    def ask(self, prompt: str) -> str:
        """Send a prompt and return the generated text."""
        ...
