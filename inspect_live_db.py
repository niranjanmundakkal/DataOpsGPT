from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
with engine.begin() as conn:
    print('connected')
    print(conn.execute(text("SELECT current_schema()")).scalar())
    print(conn.execute(text("SELECT version()")).scalar())
    print(conn.execute(text("SELECT * FROM information_schema.tables WHERE table_schema='public' AND table_name='pipeline_events'" )).fetchall())
