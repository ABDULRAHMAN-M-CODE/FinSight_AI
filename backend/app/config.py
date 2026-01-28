from pydantic_settings import BaseSettings
from pydantic import Field

from typing import Optional

'''
BaseSettings automatically reads from:

Environment variables (os.environ)

A .env file (if you are using python-dotenv)

Defaults defined in the class

If none are provided and no default exists, validation fails.
'''
class Settings(BaseSettings):
    
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    REDIS_BROKER_URL: str = Field(..., env="REDIS_BROKER_URL")
    REDIS_BACKEND_URL: str = Field(..., env="REDIS_BACKEND_URL")
    HOST: str = Field("0.0.0.0", env="HOST")
    PORT: int = Field(8000, env="PORT")
    WORKERS: int = Field(1, env="WORKERS")

    OPENAI_API_KEY: Optional[str] = None
    LANGSMITH_API_KEY: Optional[str] = None
    LANGGRAPH_URL: Optional[str] = None
    celery_broker_url: str = "redis://redis:6379/0"
    celery_result_backend: str = "redis://redis:6379/1"

    class Config:
        env_file = ".env"

settings = Settings()