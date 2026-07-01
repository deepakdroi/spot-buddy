"""User database model for SQLAlchemy"""
import uuid
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, DateTime, Boolean
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base


class User(SQLAlchemyBaseUserTable[str], Base):
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hashed_password: Mapped[str] = mapped_column("hashedPassword", String(length=1024), nullable=False)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column("isSuperuser", Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column("isVerified", Boolean, default=False, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    dob: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, default=func.now(), onupdate=func.now(), nullable=False)