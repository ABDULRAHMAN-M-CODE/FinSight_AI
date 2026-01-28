from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

# Async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

# Utility dependency
async def get_async_session():
    async with async_session() as session:
        yield session