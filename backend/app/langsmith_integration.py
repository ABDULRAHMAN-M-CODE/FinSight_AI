from app.config import settings
import os
import logging

logger = logging.getLogger(__name__)

def init_langsmith_tracing():
    """
    Optional LangSmith tracing initialization.
    - Sets environment variables required by LangSmith if LANGSMITH_API_KEY is present.
    - Attempts to import langsmith SDK and enable tracing if available.
    This function is safe to call even if LangSmith SDK is not installed.
    """
    key = os.getenv("LANGSMITH_API_KEY", settings.LANGSMITH_API_KEY)
    if not key:
        logger.info("LANGSMITH_API_KEY not set; LangSmith tracing disabled.")
        return False

    # Export env vars used by LangChain/SDKs
    os.environ["LANGSMITH_API_KEY"] = key
    os.environ["LANGSMITH_TRACING"] = "true"
    os.environ["LANGSMITH_PROJECT"] = os.getenv("LANGSMITH_PROJECT", "finadvisor")

    try:
        # If langsmith SDK installed, configure client (optional)
        import langsmith
        # Initialize client safely if available (actual API may differ across versions)
        # We avoid tight coupling; presence is a hint only.
        logger.info("LangSmith SDK detected; tracing enabled via environment variables.")
    except Exception:
        logger.info("LangSmith SDK not installed; tracing environment variables set. Install the SDK to forward traces.")
    return True