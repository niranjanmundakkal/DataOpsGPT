from sqlalchemy import text
from app.db.session import engine

conn = engine.connect()
print(conn.execute(text("SELECT version()")).scalar())
print(conn.execute(text("SELECT current_schema()")).scalar())
print(conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).fetchall())
print(conn.execute(text("SELECT * FROM alembic_version")).fetchall())
conn.close()
