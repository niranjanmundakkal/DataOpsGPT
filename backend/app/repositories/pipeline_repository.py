from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pipeline import Pipeline


class PipelineRepository:
    def create(self, db: Session, pipeline: Pipeline) -> Pipeline:
        db.add(pipeline)
        db.commit()
        db.refresh(pipeline)
        return pipeline

    def get_all(self, db: Session) -> list[Pipeline]:
        return list(db.scalars(select(Pipeline)).all())
