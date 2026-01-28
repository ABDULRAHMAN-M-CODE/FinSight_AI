from celery import Celery
from app.config import settings
import os
import logging

logger = logging.getLogger(__name__)

CELERY_BROKER = os.getenv("CELERY_BROKER_URL", settings.REDIS_BROKER_URL)
CELERY_BACKEND = os.getenv("CELERY_RESULT_BACKEND", settings.REDIS_BACKEND_URL)

celery_app = Celery(
    "app.celery_app",
    broker=CELERY_BROKER,
    backend=CELERY_BACKEND,
)

# Basic config
celery_app.conf.update(
    result_expires=3600,
    task_track_started=True,
    accept_content=["json"],
    task_serializer="json",
    result_serializer="json",
    enable_utc=True,
)

# Periodic task schedule (Celery Beat)
# - monitor_all_users runs every hour (3600 seconds)
celery_app.conf.beat_schedule = {
    "monitor-all-users-every-hour": {
        "task": "app.tasks.monitor_all_users",
        "schedule": 3600.0,
    }
}

logger.info("Celery configured: broker=%s backend=%s", CELERY_BROKER, CELERY_BACKEND)