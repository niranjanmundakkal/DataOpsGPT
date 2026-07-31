import unittest
from unittest.mock import MagicMock, patch

from app.agents.lineage_agent import lineage_agent
from app.agents.supervisor import supervisor


class LineageAgentTests(unittest.TestCase):
    @patch("app.agents.lineage_agent.get_neo4j")
    @patch("app.agents.lineage_agent.get_llm")
    def test_lineage_agent(self, mock_get_llm, mock_get_neo4j):
        # Setup mock Neo4j driver
        mock_driver = MagicMock()
        mock_session = MagicMock()
        mock_driver.session.return_value.__enter__.return_value = mock_session
        
        # Mock session.run result
        mock_record = {
            "p.name": "Customer Pipeline",
            "t.name": "customer_data",
            "d.name": "Customer Analytics"
        }
        mock_session.run.return_value = [mock_record]
        mock_get_neo4j.return_value = mock_driver

        # Setup mock LLM
        mock_llm = MagicMock()
        mock_llm.generate.return_value = "Impact analysis output"
        mock_get_llm.return_value = mock_llm

        state = {
            "question": "What dashboards are affected if Customer Pipeline fails?",
            "agent": "",
            "context": "",
            "answer": "",
            "tools_used": []
        }

        # Run agent
        new_state = lineage_agent(state)

        # Asserts
        self.assertEqual(new_state["answer"], "Impact analysis output")
        self.assertEqual(new_state["tools_used"], ["neo4j", "lineage", "llm"])
        mock_session.run.assert_called_once()

    def test_supervisor_routes_to_lineage_agent(self):
        state = {
            "question": "What dashboards are affected if Customer Pipeline fails?",
            "agent": "",
            "context": "",
            "answer": "",
            "tools_used": []
        }

        with patch("app.agents.supervisor.lineage_agent") as mock_lineage_agent:
            mock_lineage_agent.return_value = {"agent": "lineage_agent", "answer": "routed"}
            res = supervisor(state)
            self.assertEqual(res["agent"], "lineage_agent")
            mock_lineage_agent.assert_called_once_with(state)


if __name__ == "__main__":
    unittest.main()
