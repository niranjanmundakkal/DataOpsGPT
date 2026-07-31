from app.llm.factory import get_llm
from app.agents.tools import retrieve_metadata
from app.agents.prompts import METADATA_PROMPT


def metadata_agent(state: dict) -> dict:
    """Metadata Agent: Manages data schemas, catalogs, owners, and tables metadata."""
    tables = ["orders", "customers", "inventory"]
    metadata_context = ""
    for table in tables:
        if table in state["question"].lower():
            meta = retrieve_metadata(table)
            metadata_context += f"Table metadata for '{table}':\n{str(meta)}\n\n"

    if not metadata_context:
        metadata_context = "General schema catalog details: tables include orders, customers, inventory."

    prompt = f"""{METADATA_PROMPT}

Available metadata context:
{metadata_context}

User question: {state['question']}
"""
    llm = get_llm()
    state["answer"] = llm.generate(prompt)
    state["tools_used"] = ["postgres", "llm"]
    return state


def run_metadata_agent(question: str) -> str:
    state = {
        "question": question,
        "agent": "metadata_agent",
        "context": "",
        "answer": "",
        "tools_used": [],
    }
    return metadata_agent(state)["answer"]
