from app.search.retriever import search_events
from app.db.session import SessionLocal
from app.pipelines.models import Pipeline, PipelineRun
from app.events.models import PipelineEvent
from sqlalchemy import text


def get_pipeline_events():
    """Fetch all pipeline events from PostgreSQL database."""
    db = SessionLocal()
    try:
        events = db.query(PipelineEvent).all()
        result = []
        for event in events:
            result.append(
                {
                    "pipeline_id": event.pipeline_id,
                    "status": event.status,
                    "type": event.event_type,
                    "message": event.message,
                }
            )
        return result
    finally:
        db.close()


def search_qdrant(query: str, limit: int = 5):
    """Semantically search Qdrant for error knowledge base and logs."""
    return search_events(query, limit=limit)


def query_postgres(sql: str):
    """Execute a raw SELECT SQL query on the PostgreSQL database."""
    if not sql.strip().lower().startswith("select"):
        return {"error": "Only SELECT queries are allowed."}

    db = SessionLocal()
    try:
        result = db.execute(text(sql))
        columns = result.keys()
        rows = [dict(zip(columns, row)) for row in result.fetchall()]
        return rows
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def fetch_pipeline_events(pipeline_id: int, limit: int = 10):
    """Fetch recent pipeline events for a specific pipeline ID."""
    db = SessionLocal()
    try:
        events = (
            db.query(PipelineEvent)
            .filter(PipelineEvent.pipeline_id == pipeline_id)
            .order_by(PipelineEvent.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": ev.id,
                "pipeline_id": ev.pipeline_id,
                "status": ev.status,
                "event_type": ev.event_type,
                "severity": ev.severity,
                "message": ev.message,
                "created_at": ev.created_at.isoformat() if ev.created_at else None,
            }
            for ev in events
        ]
    finally:
        db.close()


def retrieve_metadata(table_name: str):
    """Retrieve catalog schema, ownership, and metadata information for a given table name."""
    db = SessionLocal()
    try:
        metadata_catalog = {
            "orders": {
                "description": "Customer purchase transaction records.",
                "owner": "Sales Team",
                "columns": {
                    "id": "INTEGER PRIMARY KEY",
                    "customer_id": "INTEGER FOREIGN KEY to customers.id",
                    "total_amount": "DECIMAL(10,2)",
                    "created_at": "TIMESTAMP",
                },
            },
            "customers": {
                "description": "User profiles and registry.",
                "owner": "CRM Team",
                "columns": {
                    "id": "INTEGER PRIMARY KEY",
                    "name": "VARCHAR(100)",
                    "email": "VARCHAR(150)",
                    "status": "VARCHAR(30)",
                },
            },
            "inventory": {
                "description": "Stock levels and product availability.",
                "owner": "Logistics Team",
                "columns": {
                    "product_id": "INTEGER PRIMARY KEY",
                    "quantity": "INTEGER",
                    "warehouse_location": "VARCHAR(100)",
                },
            },
        }
        name_lower = table_name.lower()
        if name_lower in metadata_catalog:
            return metadata_catalog[name_lower]

        result = db.execute(
            text(
                f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{name_lower}'"
            )
        )
        rows = result.fetchall()
        if rows:
            return {
                "table_name": name_lower,
                "description": "Active PostgreSQL table",
                "owner": "Data Engineering Team",
                "columns": {r[0]: r[1] for r in rows},
            }

        return {"error": f"Table '{table_name}' not found in metadata catalog."}
    finally:
        db.close()
