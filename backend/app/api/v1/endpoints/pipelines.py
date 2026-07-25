from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.pipeline import PipelineCreate, PipelineResponse
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
