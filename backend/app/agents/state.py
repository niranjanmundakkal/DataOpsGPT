from typing import TypedDict, List


class AgentState(TypedDict):
    question: str
    agent: str
    context: str
    answer: str
    tools_used: List[str]
