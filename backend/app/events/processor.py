def process_pipeline_event(event: dict) -> dict:
    """Process a raw Kafka pipeline event into a structured form."""
    error = event.get("error", "")
    return {
        "pipeline_id": event.get("pipeline_id"),
        "status": event.get("status"),
        "event_type": classify_error(error),
        "severity": calculate_severity(error),
        "message": error,
    }


def classify_error(error: str) -> str:
    error = error.lower()
    if "column" in error or "schema" in error:
        return "SCHEMA_ERROR"
    if "timeout" in error:
        return "TIMEOUT_ERROR"
    return "UNKNOWN_ERROR"


def calculate_severity(error: str) -> str:
    error = error.lower()
    if "missing" in error:
        return "HIGH"
    if "warning" in error:
        return "MEDIUM"
    return "LOW"
