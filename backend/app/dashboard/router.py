from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.dependencies import get_db
from app.pipelines.models import Pipeline, PipelineRun
from app.events.models import PipelineEvent
from app.auth.jwt import get_current_user
from app.auth.models import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    total_pipelines = db.query(Pipeline).count()
    failed_runs = (
        db.query(PipelineRun)
        .filter(PipelineRun.status == "FAILED")
        .count()
    )
    event_count = db.query(PipelineEvent).count()

    return {
        "total_pipelines": total_pipelines,
        "failed_runs": failed_runs,
        "pipeline_events": event_count,
    }
