import unittest
from unittest.mock import MagicMock, patch

from app.agents.pipeline_agent import pipeline_agent


class PipelineAgentTests(unittest.TestCase):
    def test_pipeline_agent_uses_available_pipeline_fields(self):
        fake_pipeline = MagicMock()
        fake_pipeline.id = 1
        fake_pipeline.name = "Inventory Pipeline"
        fake_pipeline.owner = "data-team"
        fake_pipeline.schedule = "daily"
        fake_pipeline.status = "active"
        fake_pipeline.description = None

        fake_db = MagicMock()
        fake_db.query.return_value.all.return_value = [fake_pipeline]

        fake_llm = MagicMock()
        fake_llm.generate.return_value = "Inventory Pipeline"

        with patch("app.agents.pipeline_agent.SessionLocal", return_value=fake_db), patch(
            "app.agents.pipeline_agent.get_llm", return_value=fake_llm
        ):
            state = pipeline_agent({"question": "Which pipeline loads inventory?", "answer": "", "tools_used": []})

        self.assertEqual(state["answer"], "Inventory Pipeline")
        self.assertEqual(state["tools_used"], ["postgres", "pipeline_metadata", "llm"])
        fake_db.close.assert_called_once()


if __name__ == "__main__":
    unittest.main()
