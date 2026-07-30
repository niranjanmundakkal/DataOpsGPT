from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.pipeline import (
    PipelineCreate,
    PipelineResponse,
    PipelineUpdate,
)
from app.services.pipeline_service import PipelineService

router = APIRouter(prefix="/pipelines", tags=["Pipelines"])

service = PipelineService()


@router.post("", response_model=PipelineResponse)
def create_pipeline(
    request: PipelineCreate,
    db: Session = Depends(get_db),
):
    return service.create_pipeline(db, request)


@router.get("", response_model=list[PipelineResponse])
def get_pipelines(
    db: Session = Depends(get_db),
):
    return service.get_pipelines(db)


@router.get("/{pipeline_id}", response_model=PipelineResponse)
def get_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
):
    pipeline = service.get_pipeline(db, pipeline_id)

    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return pipeline


@router.put("/{pipeline_id}", response_model=PipelineResponse)
def update_pipeline(
    pipeline_id: int,
    pipeline: PipelineUpdate,
    db: Session = Depends(get_db),
):
    updated = service.update_pipeline(db, pipeline_id, pipeline)

    if not updated:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return updated


@router.delete("/{pipeline_id}")
def delete_pipeline(
    pipeline_id: int,
    db: Session = Depends(get_db),
):
    deleted = service.delete_pipeline(db, pipeline_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    return {"message": "Pipeline deleted successfully"}
