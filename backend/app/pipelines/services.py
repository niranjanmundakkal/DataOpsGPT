from sqlalchemy.orm import Session
from sqlalchemy import select
from app.pipelines.models import Pipeline, PipelineRun
from app.pipelines.schemas import PipelineCreate, PipelineUpdate, PipelineRunCreate

class PipelineService:
    def create_pipeline(self, db: Session, request: PipelineCreate) -> Pipeline:
        pipeline = Pipeline(
            name=request.name,
            owner=request.owner,
            schedule=request.schedule,
            status=request.status,
        )
        db.add(pipeline)
        db.commit()
        db.refresh(pipeline)
        return pipeline

    def get_pipelines(self, db: Session) -> list[Pipeline]:
        return list(db.scalars(select(Pipeline)).all())

    def get_pipeline(self, db: Session, pipeline_id: int) -> Pipeline | None:
        return db.query(Pipeline).filter(Pipeline.id == pipeline_id).first()

    def update_pipeline(self, db: Session, pipeline_id: int, request: PipelineUpdate) -> Pipeline | None:
        pipeline = self.get_pipeline(db, pipeline_id)
        if not pipeline:
            return None
        if request.name is not None:
            pipeline.name = request.name
        if request.owner is not None:
            pipeline.owner = request.owner
        if request.schedule is not None:
            pipeline.schedule = request.schedule
        if request.status is not None:
            pipeline.status = request.status
        db.commit()
        db.refresh(pipeline)
        return pipeline

    def delete_pipeline(self, db: Session, pipeline_id: int) -> bool:
        pipeline = self.get_pipeline(db, pipeline_id)
        if not pipeline:
            return False
        db.delete(pipeline)
        db.commit()
        return True

class PipelineRunService:
    def create_pipeline_run(self, db: Session, request: PipelineRunCreate) -> PipelineRun:
        run = PipelineRun(
            pipeline_id=request.pipeline_id,
            status=request.status,
            started_at=request.started_at,
            finished_at=request.finished_at,
        )
        db.add(run)
        db.commit()
        db.refresh(run)
        return run

    def get_pipeline_runs(self, db: Session) -> list[PipelineRun]:
        return db.query(PipelineRun).all()

    def get_pipeline_run(self, db: Session, run_id: int) -> PipelineRun | None:
        return db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
