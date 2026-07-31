from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.auth.jwt import check_role
from app.auth.models import User
from app.pipelines.schemas import (
    PipelineCreate,
    PipelineResponse,
    PipelineUpdate,
    PipelineRunCreate,
    PipelineRunResponse,
    LineageCreate,
)
from app.pipelines.services import PipelineService, PipelineRunService

pipeline_router = APIRouter(
    prefix="/pipelines",
    tags=["Pipelines"],
    dependencies=[Depends(check_role(["ADMIN", "DATA_ENGINEER"]))]
)
run_router = APIRouter(
    prefix="/pipeline-runs",
    tags=["Pipeline Runs"],
    dependencies=[Depends(check_role(["ADMIN", "DATA_ENGINEER"]))]
)

pipeline_service = PipelineService()
run_service = PipelineRunService()


@pipeline_router.post("", response_model=PipelineResponse)
def create_pipeline(request: PipelineCreate, db: Session = Depends(get_db)):
    return pipeline_service.create_pipeline(db, request)

@pipeline_router.post("/lineage")
def register_lineage(request: LineageCreate):
    from app.services.lineage_service import add_pipeline_lineage
    add_pipeline_lineage(
        pipeline_name=request.pipeline_name,
        table_name=request.table_name,
        dashboard_name=request.dashboard_name,
        owner_name=request.owner_name,
    )
    return {"message": "Lineage relationship registered successfully"}

@pipeline_router.get("", response_model=list[PipelineResponse])
def get_pipelines(db: Session = Depends(get_db)):
    return pipeline_service.get_pipelines(db)

@pipeline_router.get("/{pipeline_id}", response_model=PipelineResponse)
def get_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    pipeline = pipeline_service.get_pipeline(db, pipeline_id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return pipeline

@pipeline_router.put("/{pipeline_id}", response_model=PipelineResponse)
def update_pipeline(pipeline_id: int, pipeline: PipelineUpdate, db: Session = Depends(get_db)):
    updated = pipeline_service.update_pipeline(db, pipeline_id, pipeline)
    if not updated:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return updated

@pipeline_router.delete("/{pipeline_id}")
def delete_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    deleted = pipeline_service.delete_pipeline(db, pipeline_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return {"message": "Pipeline deleted successfully"}


@run_router.post("", response_model=PipelineRunResponse)
def create_pipeline_run(request: PipelineRunCreate, db: Session = Depends(get_db)):
    return run_service.create_pipeline_run(db, request)

@run_router.get("", response_model=list[PipelineRunResponse])
def get_pipeline_runs(db: Session = Depends(get_db)):
    return run_service.get_pipeline_runs(db)

@run_router.get("/{run_id}", response_model=PipelineRunResponse)
def get_pipeline_run(run_id: int, db: Session = Depends(get_db)):
    run = run_service.get_pipeline_run(db, run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Pipeline run not found")
    return run
