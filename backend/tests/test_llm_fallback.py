import unittest
from unittest.mock import patch

from app.core.llm import ask_llm


class FirstProvider:
    def generate(self, prompt: str) -> str:
        raise RuntimeError("groq failed")


class SecondProvider:
    def generate(self, prompt: str) -> str:
        return "fallback response"


class LLMFallbackTests(unittest.TestCase):
    def test_ask_llm_falls_back_to_gemini_when_primary_provider_fails(self):
        # Mock get_llm to return the failing FirstProvider
        # Mock GeminiLLM constructor to return SecondProvider
        with patch("app.core.llm.get_llm", return_value=FirstProvider()) as mock_get_llm:
            with patch("app.core.llm.GeminiLLM", return_value=SecondProvider()):
                with patch("app.core.llm.settings.LLM_PROVIDER", "groq"):
                    response = ask_llm("hello")

        self.assertEqual(response, "fallback response")
        mock_get_llm.assert_called_once()


if __name__ == "__main__":
    unittest.main()
