from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Pipeline(Base):
    __tablename__ = "pipelines"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    owner: Mapped[str] = mapped_column(String(100))
    schedule: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30))

    runs: Mapped[list["PipelineRun"]] = relationship(
        back_populates="pipeline",
        cascade="all, delete-orphan",
    )

class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    pipeline_id: Mapped[int] = mapped_column(
        ForeignKey("pipelines.id")
    )
    status: Mapped[str] = mapped_column(String(30))
    started_at: Mapped[datetime] = mapped_column(DateTime)
    finished_at: Mapped[datetime] = mapped_column(DateTime)

    pipeline: Mapped["Pipeline"] = relationship(
        back_populates="runs"
    )
