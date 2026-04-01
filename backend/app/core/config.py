from pydantic_settings import BaseSettings

#this class validates the contents of the .env file
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
    TWELVEDATA_API_KEY:str
    class Config:
        env_file = ".env"


settings = Settings()
