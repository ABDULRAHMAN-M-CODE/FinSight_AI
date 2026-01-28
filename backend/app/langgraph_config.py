"""
LangGraph configuration and helpers.

This file centralizes imports and PostgresSaver creation for the StateGraph.
It follows the repository's examples (langgraph.checkpoint.postgres.PostgresSaver).
"""

from typing import Optional
import os
from app.config import settings

# The repository docs indicate PostgresSaver requires a DB connection string.
# We will reuse DATABASE_URL from settings, which is expected to be an asyncpg URL.
DATABASE_URL = os.getenv("DATABASE_URL", settings.DATABASE_URL)

# Exported names for other modules
POSTGRES_CONN = DATABASE_URL

# Note: PostgresSaver is created in langgraph_service where langgraph is imported
# so this module only exports the connection URL.