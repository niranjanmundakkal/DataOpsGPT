from prometheus_client import Counter

# Custom Prometheus counters for pipeline data events
kafka_messages_consumed_total = Counter(
    "kafka_messages_consumed_total",
    "Total number of Kafka messages consumed from the pipeline-runs topic"
)

pipeline_events_processed_total = Counter(
    "pipeline_events_processed_total",
    "Total number of pipeline events successfully processed"
)

pipeline_failures_total = Counter(
    "pipeline_failures_total",
    "Total number of pipeline execution failures detected"
)
