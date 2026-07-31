from app.database.neo4j import get_neo4j

def create_lineage():
    driver = get_neo4j()

    with driver.session() as session:
        session.run(
        """
        MERGE (p:Pipeline {
            name:'Customer Pipeline'
        })

        MERGE (t:Table {
            name:'customer_data'
        })

        MERGE (d:Dashboard {
            name:'Customer Analytics'
        })


        MERGE (p)-[:LOADS]->(t)

        MERGE (t)-[:USED_BY]->(d)
        """
        )

def add_pipeline_lineage(pipeline_name: str, table_name: str, dashboard_name: str, owner_name: str):
    driver = get_neo4j()
    with driver.session() as session:
        session.run(
            """
            MERGE (p:Pipeline {name: $pipeline_name})
            MERGE (t:Table {name: $table_name})
            MERGE (d:Dashboard {name: $dashboard_name})
            MERGE (o:Owner {name: $owner_name})
            MERGE (p)-[:LOADS]->(t)
            MERGE (t)-[:USED_BY]->(d)
            MERGE (p)-[:OWNED_BY]->(o)
            """,
            pipeline_name=pipeline_name,
            table_name=table_name,
            dashboard_name=dashboard_name,
            owner_name=owner_name
        )

