from app.search.vector_store import search_vectors, client, COLLECTION_NAME


def search_similar_incidents(query_vector: list[float], limit: int = 5):
    """Search Qdrant for similar incidents using query vector."""
    try:
        points = search_vectors(embedding=query_vector, limit=limit)
        results = []
        for hit in points:
            payload = getattr(hit, "payload", {}) or {}
            results.append(
                {
                    "id": getattr(hit, "id", None),
                    "score": getattr(hit, "score", 0.0),
                    "message": payload.get("message", ""),
                    "pipeline_id": payload.get("pipeline_id"),
                    "status": payload.get("status"),
                    "severity": payload.get("severity"),
                }
            )
        return results
    except Exception as e:
        print(f"Qdrant search warning: {e}")
        return []
