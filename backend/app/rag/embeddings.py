from app.search.embeddings import generate_embedding


def create_embedding(text: str) -> list[float]:
    return generate_embedding(text)
