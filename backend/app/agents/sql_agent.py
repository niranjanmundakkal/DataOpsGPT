from app.llm.factory import get_llm


def sql_agent(state: dict) -> dict:
    """SQL Agent for LangGraph state processing."""
    prompt = f"""
You are a SQL Data Engineer.

User request:
{state['question']}

Generate:

1. SQL query
2. Explanation
3. Optimization suggestions

Make sure the SQL is safe and readable.
"""

    llm = get_llm()
    answer = llm.generate(prompt)

    state["answer"] = answer
    state["tools_used"] = ["llm"]
    return state


run_sql_agent = sql_agent
