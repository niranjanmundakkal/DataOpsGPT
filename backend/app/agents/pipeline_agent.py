from app.db.session import SessionLocal
from app.pipelines.models import Pipeline
from app.llm.factory import get_llm
from app.agents.prompts import PIPELINE_PROMPT


def pipeline_agent(state: dict) -> dict:
    """Pipeline Agent: Queries PostgreSQL pipelines table and answers pipeline-related questions."""
    db = SessionLocal()
    try:
        pipelines = db.query(Pipeline).all()

        pipeline_data = []
        for p in pipelines:
            pipeline_data.append(
                {
                    "id": p.id,
                    "name": p.name,
                    "owner": getattr(p, "owner", None),
                    "schedule": getattr(p, "schedule", None),
                    "status": getattr(p, "status", None),
                    "description": getattr(p, "description", None),
                }
            )

        prompt = f"""{PIPELINE_PROMPT}

User question:
{state['question']}

Available pipelines:
{pipeline_data}

Answer clearly using the pipeline information.
"""
        llm = get_llm()
        state["answer"] = llm.generate(prompt)
        state["tools_used"] = ["postgres", "pipeline_metadata", "llm"]
        return state

    finally:
        db.close()


def run_pipeline_agent(question: str) -> str:
    state = {
        "question": question,
        "agent": "pipeline_agent",
        "context": "",
        "answer": "",
        "tools_used": [],
    }
    return pipeline_agent(state)["answer"]
