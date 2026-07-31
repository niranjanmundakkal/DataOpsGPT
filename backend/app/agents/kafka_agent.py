from app.llm.factory import get_llm
from app.agents.prompts import KAFKA_PROMPT


def kafka_agent(state: dict) -> dict:
    """Kafka Agent: Provides topic metrics, broker status, consumer lag details, and partition offsets."""
    kafka_context = """
Kafka Broker: Connected (Healthy)
Bootstrap Servers: localhost:9092
Consumer Groups:
- pipeline-run-consumer-group:
  - Topic: pipeline_run_events
  - Consumer Lag: 0 messages
  - Message Throughput: 15 msgs/sec
  - Partitions: 3 Active
    """

    prompt = f"""{KAFKA_PROMPT}

Streaming cluster metrics:
{kafka_context}

User question: {state['question']}
"""
    llm = get_llm()
    state["answer"] = llm.generate(prompt)
    state["tools_used"] = ["llm"]
    return state


def run_kafka_agent(question: str) -> str:
    state = {
        "question": question,
        "agent": "kafka_agent",
        "context": "",
        "answer": "",
        "tools_used": [],
    }
    return kafka_agent(state)["answer"]
