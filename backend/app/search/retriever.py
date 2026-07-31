from app.search.embeddings import generate_embedding
from app.search.vector_store import search_vectors


def retrieve(query: str, limit: int = 5):
    """Retrieve top-N semantically similar results from Qdrant."""
    embedding = generate_embedding(query)
    return search_vectors(embedding=embedding, limit=limit)


def search_events(query: str, limit: int = 5) -> list[dict]:
    """Search Qdrant and return results as a list of dicts."""
    points = retrieve(query, limit=limit)
    return [
        {"id": hit.id, "score": getattr(hit, "score", 0.0), "payload": hit.payload}
        for hit in points
    ]


# Alias
search = retrieve
