from app.rag.embeddings import generate_embedding


text = "Customer pipeline failed because CustomerID column missing"

embedding = generate_embedding(text)

print(len(embedding))
print(embedding[:10])
