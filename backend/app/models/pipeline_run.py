from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id: Mapped[int] = mapped_column(primary_key=True)

    pipeline_id: Mapped[int] = mapped_column(
        ForeignKey("pipelines.id")
    )

    status: Mapped[str] = mapped_column(String(30))

    started_at: Mapped[datetime] = mapped_column(DateTime)

    finished_at: Mapped[datetime] = mapped_column(DateTime)

    pipeline = relationship("Pipeline")