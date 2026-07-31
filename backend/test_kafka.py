from kafka import KafkaProducer
import json


producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda data: json.dumps(data).encode("utf-8")
)


event = {
    "event": "PIPELINE_RUN_CREATED",
    "pipeline_id": 101,
    "status": "FAILED",
    "error": "CustomerID column missing"
}


producer.send(
    "pipeline-runs",
    value=event
)

producer.flush()

print("Event sent")