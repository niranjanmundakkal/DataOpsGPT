from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.begin() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS pipeline_events (
            id SERIAL PRIMARY KEY,
            pipeline_id INTEGER,
            status VARCHAR,
            event_type VARCHAR,
            severity VARCHAR,
            message VARCHAR,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    print('pipeline_events table created or already exists')
