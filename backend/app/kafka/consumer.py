import json

from kafka import KafkaConsumer

from app.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    PIPELINE_RUN_TOPIC,
    CONSUMER_GROUP_ID,
)

from app.events.processor import process_pipeline_event
from app.db.session import SessionLocal
from app.events.repository import save_pipeline_event
from app.search.ingestion import ingest_event
from app.core.metrics import (
    kafka_messages_consumed_total,
    pipeline_events_processed_total,
    pipeline_failures_total,
)


def deserialize_json(data: bytes | None):

    if data is None:
        return None

    return json.loads(data.decode("utf-8"))


consumer = KafkaConsumer(
    PIPELINE_RUN_TOPIC,
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    group_id=CONSUMER_GROUP_ID,
    auto_offset_reset="earliest",
    value_deserializer=deserialize_json,
)


def consume_events(asyncio_loop=None):

    print("Kafka Consumer Started...")

    db = SessionLocal()

    try:
        for message in consumer:

            event = message.value

            print("\nRaw Event:")
            print(event)

            # Increment Kafka messages consumed count
            kafka_messages_consumed_total.inc()

            processed_event = process_pipeline_event(event)

            print("\nProcessed Event:")
            print(processed_event)

            # Increment pipeline events processed count
            pipeline_events_processed_total.inc()

            # Increment pipeline failures count if status is FAILED
            if processed_event.get("status") == "FAILED":
                pipeline_failures_total.inc()

            # Ingest embedding into Qdrant (dict-based)
            ingest_event(processed_event)

            print("\nCalling database save...")
            try:
                saved_event = save_pipeline_event(db, processed_event)
                print("\nDatabase save completed")
                print(saved_event)
                print("\nSaved Event ID:")
                print(saved_event.id)

                if asyncio_loop is not None:
                    try:
                        from app.events.router import manager
                        import asyncio
                        
                        event_dict = {
                            "id": saved_event.id,
                            "pipeline_id": saved_event.pipeline_id,
                            "status": saved_event.status,
                            "event_type": saved_event.event_type,
                            "severity": saved_event.severity,
                            "message": saved_event.message,
                            "created_at": saved_event.created_at.isoformat() if saved_event.created_at else None,
                        }
                        
                        asyncio.run_coroutine_threadsafe(
                            manager.broadcast(event_dict),
                            asyncio_loop
                        )
                        print("Broadcasted event via WebSocket.")
                    except Exception as e:
                        print(f"Failed to broadcast WebSocket event: {e}")

            except Exception as exc:
                print("\nDatabase save failed")
                print(exc)
                raise

    finally:
        db.close()