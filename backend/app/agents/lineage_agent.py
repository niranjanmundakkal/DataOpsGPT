from app.database.neo4j import get_neo4j
from app.llm.factory import get_llm

def lineage_agent(state: dict) -> dict:
    driver = get_neo4j()

    with driver.session() as session:
        result = session.run(
        """
        MATCH
        (p:Pipeline)-[:LOADS]->(t:Table)
        -[:USED_BY]->(d:Dashboard)
        OPTIONAL MATCH (p)-[:OWNED_BY]->(o:Owner)

        RETURN 
        p.name AS pipeline,
        t.name AS table_name,
        d.name AS dashboard,
        o.name AS owner
        """
        )

        lineage = [
            dict(record)
            for record in result
        ]

    prompt = f"""
You are a Data Lineage Expert.

Question:
{state['question']}

Lineage:
{lineage}

Explain impact clearly.
"""

    llm = get_llm()
    state["answer"] = llm.generate(prompt)
    state["tools_used"] = [
        "neo4j",
        "lineage",
        "llm"
    ]

    return state
