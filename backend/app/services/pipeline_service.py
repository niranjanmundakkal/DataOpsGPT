from sqlalchemy.orm import Session

from app.models.pipeline import Pipeline
from app.repositories.pipeline_repository import PipelineRepository
from app.schemas.pipeline import PipelineCreate


class PipelineService:

    def __init__(self):
        self.repository = PipelineRepository()

    def create_pipeline(
        self,
        db: Session,
        request: PipelineCreate,
    ):
        pipeline = Pipeline(
            name=request.name,
            owner=request.owner,
            schedule=request.schedule,
            status=request.status,
        )

        return self.repository.create(db, pipeline)

    def get_pipelines(self, db: Session):
        return self.repository.get_all(db)