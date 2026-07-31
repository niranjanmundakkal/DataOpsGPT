from app.agents.tools import get_pipeline_events
from app.rag.embeddings import create_embedding
from app.rag.retriever import search_similar_incidents
from app.llm.factory import get_llm


def incident_agent(state: dict) -> dict:
    """RAG Incident Agent combining PostgreSQL events + Qdrant historical incidents."""
    events = get_pipeline_events()

    query_vector = create_embedding(state["question"])
    similar = search_similar_incidents(query_vector)

    prompt = f"""
You are a DataOps Incident Agent.

User Question:
{state['question']}

Current Pipeline Events:
{events}

Similar Historical Incidents:
{similar}

Provide:
1. Root cause
2. Impact
3. Recommended fix
4. Prevention steps
"""

    llm = get_llm()
    answer = llm.generate(prompt)

    state["answer"] = answer
    state["tools_used"] = ["postgres", "qdrant", "llm"]

    return state


def run_incident_agent(question: str) -> dict:
    """Direct helper function for running incident agent."""
    state = {
        "question": question,
        "agent": "incident_agent",
        "context": "",
        "answer": "",
        "tools_used": [],
    }
    res = incident_agent(state)
    return res
