from pydantic_settings import BaseSettings

# the main configuration file for database URL and secrets access
class Settings(BaseSettings):
    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    TOKEN_SECRET: str
    OPENAI_API_KEY: str
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    FROM_EMAIL: str

    class Config:
        env_file = ".env"


settings = Settings()
