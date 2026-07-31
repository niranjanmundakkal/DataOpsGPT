from app.search.embeddings import generate_embedding
from app.search.vector_store import insert_vector


def ingest_event(event: dict):
    """Embed a pipeline event and store it in Qdrant."""
    text = f"""
    Pipeline ID: {event['pipeline_id']}
    Status: {event['status']}
    Event Type: {event['event_type']}
    Severity: {event['severity']}
    Message: {event['message']}
    """
    embedding = generate_embedding(text)
    insert_vector(point_id=event["pipeline_id"], embedding=embedding, payload=event)
    print("Embedding Stored")
