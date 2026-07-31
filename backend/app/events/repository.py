from app.events.models import PipelineEvent


def save_pipeline_event(db, event: dict) -> PipelineEvent:
    """Persist a processed pipeline event to the database."""
    pipeline_event = PipelineEvent(
        pipeline_id=event.get("pipeline_id"),
        status=event.get("status"),
        event_type=event.get("event_type"),
        severity=event.get("severity"),
        message=event.get("message"),
    )
    db.add(pipeline_event)
    db.commit()
    db.refresh(pipeline_event)
    return pipeline_event
