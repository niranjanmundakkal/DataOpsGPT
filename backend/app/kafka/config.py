from app.core.config import settings

KAFKA_BOOTSTRAP_SERVERS = settings.KAFKA_BOOTSTRAP_SERVERS

PIPELINE_RUN_TOPIC = "pipeline-runs"

CONSUMER_GROUP_ID = "dataopsgpt-consumer-group"