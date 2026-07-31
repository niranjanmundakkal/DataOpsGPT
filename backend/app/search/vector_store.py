from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.search.config import QDRANT_HOST, QDRANT_PORT, COLLECTION_NAME

client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)


def create_collection():
    collections = client.get_collections().collections
    names = [c.name for c in collections]
    if COLLECTION_NAME not in names:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        print("Collection Created")
    else:
        print("Collection Already Exists")


def insert_vector(point_id: int, embedding: list[float], payload: dict):
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[PointStruct(id=point_id, vector=embedding, payload=payload)],
    )


def search_vectors(embedding: list[float], limit: int = 5):
    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=limit,
    )
    return response.points
