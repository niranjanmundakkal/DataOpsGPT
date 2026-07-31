from app.rag.retriever import retrieve

results = retrieve("CustomerID missing")

for result in results:
    print(result.payload)
