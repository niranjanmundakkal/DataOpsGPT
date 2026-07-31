from groq import Groq
from app.core.llm.base import LLMProvider
from app.core.config import settings


class GroqProvider(LLMProvider):
    """Groq LLM provider (LLaMA, Mixtral, etc.)."""

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.MODEL

    def ask(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "You are DataOpsGPT, an expert Data Engineering Assistant.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )
        return response.choices[0].message.content
