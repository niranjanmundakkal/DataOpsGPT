from fastapi import APIRouter, Depends
from app.chat.schemas import ChatRequest
from app.agents.graph import agent_graph
from app.auth.jwt import get_current_user
from app.auth.models import User

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    """
    Multi-Agent Chat endpoint: Invokes the LangGraph agent_graph with AgentState.
    Returns structured answer, agent name, and tools used.
    """
    result = agent_graph.invoke(
        {
            "question": request.question,
            "agent": "",
            "context": "",
            "answer": "",
            "tools_used": [],
        }
    )
    return {
        "answer": result["answer"],
        "agent": result.get("agent", ""),
        "tools_used": result.get("tools_used", []),
    }
