"""FastAPI main application setup"""
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import JWTStrategy, AuthenticationBackend, BearerTransport
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from os import getenv
import uuid

from app.models import User, Base
from app.database import engine, get_async_session
from app.schemas import UserRead, UserCreate, UserUpdate


# Initialize FastAPI app
app = FastAPI(title="Spot Buddy API", version="1.0.0")

# CORS Configuration
CORS_ORIGINS = getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
JWT_SECRET = getenv("JWT_SECRET", "super-secret-key-change-me-in-production")


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=JWT_SECRET, lifetime_seconds=3600)
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

class UserManager(BaseUserManager[User, str]):
    reset_password_token_secret = JWT_SECRET
    verification_token_secret = JWT_SECRET

    def parse_id(self, value: str) -> str:
        return value
    
    async def on_after_register(self, user: User, request: Request | None = None):
        print(f"User {user.id} has registered.")

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,
    [auth_backend],
)

# Generate UUID for new users
def get_user_id() -> str:
    return str(uuid.uuid4())


# User routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to Spot Buddy API"}


# Health check
@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
