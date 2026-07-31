from sentence_transformers import SentenceTransformer

# Load model only once (globally) to avoid reloading on every call
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text: str) -> list[float]:
    """
    Convert text into a 384-dimensional vector embedding.
    Uses the all-MiniLM-L6-v2 model which produces 384-dim vectors.
    """
    if not text:
        text = ""
    embedding = model.encode(text)
    return embedding.tolist()


# Alias for backward compatibility
get_embedding = generate_embedding
