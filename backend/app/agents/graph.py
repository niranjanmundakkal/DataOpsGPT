from langgraph.graph import StateGraph, START, END

from app.agents.state import AgentState
from app.agents.supervisor import supervisor


graph = StateGraph(AgentState)

graph.add_node("supervisor", supervisor)

graph.add_edge(START, "supervisor")
graph.add_edge("supervisor", END)

agent_graph = graph.compile()
