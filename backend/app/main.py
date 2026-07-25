from fastapi import FastAPI
from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
import app.models  # Register all SQLAlchemy models with Base.metadata.

app = FastAPI(
    title="DataOpsGPT API",
    description="AI Powered Data Engineering Copilot",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Welcome to DataOpsGPT 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/version")
def version():
    return {
        "project": "DataOpsGPT",
        "version": "1.0.0",
    }


@app.get("/db-health")
def db_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"database": "connected"}
