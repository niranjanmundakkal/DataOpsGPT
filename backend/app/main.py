from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from prometheus_fastapi_instrumentator import Instrumentator

from app.pipelines.router import pipeline_router, run_router
from app.events.router import router as events_router
from app.chat.router import router as chat_router
from app.search.router import router as search_router
from app.dashboard.router import router as dashboard_router

from app.db.base import Base
from app.db.session import engine
import app.pipelines  # Register Pipeline + PipelineRun models
import app.events     # Register PipelineEvent model
import app.auth.models  # Register User model
from app.auth.router import router as auth_router

app = FastAPI(
    title="DataOpsGPT API",
    description="AI Powered Data Engineering Copilot",
    version="1.0.0",
)

Instrumentator().instrument(app).expose(app)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(pipeline_router, prefix="/api/v1")
app.include_router(run_router, prefix="/api/v1")
app.include_router(chat_router)
app.include_router(search_router)
app.include_router(events_router)
app.include_router(dashboard_router)
app.include_router(auth_router, prefix="/auth")


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


@app.on_event("startup")
def startup_event():
    import threading
    import asyncio
    from app.kafka.consumer import consume_events

    # Seed default users
    from app.db.session import SessionLocal
    from app.auth.models import User
    from app.auth.password import hash_password

    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            print("Seeding default users...")
            admin_user = User(
                username="admin",
                email="admin@test.com",
                password_hash=hash_password("password"),
                role="ADMIN"
            )
            engineer_user = User(
                username="engineer",
                email="engineer@test.com",
                password_hash=hash_password("password"),
                role="DATA_ENGINEER"
            )
            viewer_user = User(
                username="viewer",
                email="viewer@test.com",
                password_hash=hash_password("password"),
                role="VIEWER"
            )
            db.add_all([admin_user, engineer_user, viewer_user])
            db.commit()
            print("Default users seeded successfully.")
    except Exception as e:
        print(f"Error seeding default users: {e}")
    finally:
        db.close()

    try:
        loop = asyncio.get_event_loop()
        thread = threading.Thread(target=consume_events, args=(loop,), daemon=True)
        thread.start()
        print("FastAPI startup: Started Kafka consumer background thread successfully.")
    except Exception as e:
        print(f"FastAPI startup: Failed to start Kafka consumer background thread: {e}")

