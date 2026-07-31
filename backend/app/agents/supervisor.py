from app.agents.incident_agent import incident_agent
from app.agents.sql_agent import sql_agent
from app.agents.pipeline_agent import pipeline_agent
from app.agents.metadata_agent import metadata_agent
from app.agents.kafka_agent import kafka_agent
from app.agents.lineage_agent import lineage_agent


def supervisor(state: dict) -> dict:
    """
    LangGraph Supervisor: Routes user questions to the most appropriate specialized agent.

    Priority order:
      1. Lineage  — "impact", "affected", "lineage", "dependency"
      2. SQL     — "sql", "query", "select", "generate sql"
      3. Kafka   — "kafka", "consumer", "lag", "topic", "broker", "throughput"
      4. Metadata — "schema", "catalog", "who owns", "owner of", "table columns"
      5. Pipeline — "pipeline metadata", "pipeline owner", "schedule", "pipeline runs", "which pipeline"
      6. Incident — "fail", "error", "incident", "why did", "broke"
      7. Fallback — general info message
    """
    q = state["question"].lower()

    if any(k in q for k in ["impact", "affected", "lineage", "dependency", "breaks", "downstream", "upstream", "depends"]):
        state["agent"] = "lineage_agent"
        return lineage_agent(state)

    if any(k in q for k in ["sql", "query", "select", "generate sql"]):
        state["agent"] = "sql_agent"
        return sql_agent(state)

    if any(k in q for k in ["kafka", "consumer", "lag", "topic", "broker", "throughput"]):
        state["agent"] = "kafka_agent"
        return kafka_agent(state)

    if any(k in q for k in ["schema", "catalog", "who owns", "owner of", "table columns", "tables contain", "which columns", "columns in", "contain"]):
        state["agent"] = "metadata_agent"
        return metadata_agent(state)

    if any(k in q for k in ["pipeline", "load", "schedule", "pipeline owner", "pipeline runs", "pipeline metadata", "which pipeline", "loads"]):
        state["agent"] = "pipeline_agent"
        return pipeline_agent(state)

    if any(k in q for k in ["fail", "error", "incident", "why did", "broke"]):
        state["agent"] = "incident_agent"
        return incident_agent(state)

    state["agent"] = "supervisor"
    state["answer"] = (
        "I can help with: pipeline incidents, SQL generation, "
        "Kafka streaming metrics, data catalog & metadata, and pipeline run information."
    )
    state["tools_used"] = []
    return state


def route_and_execute(question: str) -> dict:
    from app.agents.graph import agent_graph

    return agent_graph.invoke(
        {
            "question": question,
            "agent": "",
            "context": "",
            "answer": "",
            "tools_used": [],
        }
    )
