"""Database connection and session setup"""
from dotenv import load_dotenv
from os import getenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base

load_dotenv()

DATABASE_URL = getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Create apps/backend/.env or set the environment variable before starting the backend."
    )
DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_async_session():
    async with async_session_maker() as session:
        yield session
        