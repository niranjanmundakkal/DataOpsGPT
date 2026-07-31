from groq import Groq

from app.core.config import settings
from app.llm.base import BaseLLM


class GroqLLM(BaseLLM):

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate(self, prompt: str) -> str:

        response = self.client.chat.completions.create(
            model=settings.MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content
