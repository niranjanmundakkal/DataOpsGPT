from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from app.db.base import Base


class PipelineEvent(Base):
    __tablename__ = "pipeline_events"

    id = Column(Integer, primary_key=True, index=True)
    pipeline_id = Column(Integer)
    status = Column(String)
    event_type = Column(String)
    severity = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
