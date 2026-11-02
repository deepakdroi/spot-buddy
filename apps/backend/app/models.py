"""SQLAlchemy models for the Spot Buddy backend."""
import uuid
from datetime import datetime
from typing import List

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Table, Column, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship, declared_attr
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ENUM
from .database import Base

plan_exercise_association = Table(
    "_ExerciseToPlan",
    Base.metadata,
    Column("A", String, ForeignKey("exercise.id", ondelete="CASCADE"), primary_key=True),
    Column("B", String, ForeignKey("plan.id", ondelete="CASCADE"), primary_key=True),
)

class User(SQLAlchemyBaseUserTable[str], Base):
    @declared_attr
    def __tablename__(cls) -> str:
        return "user"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    hashed_password: Mapped[str] = mapped_column("hashedPassword", String(length=1024), nullable=False)
    is_active: Mapped[bool] = mapped_column("isActive", Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column("isSuperuser", Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column("isVerified", Boolean, default=False, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    dob: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    plans: Mapped[list["Plan"]] = relationship(back_populates="user")

class Exercise(Base):
    __tablename__ = "exercise"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    body_part: Mapped[str] = mapped_column("bodyPart", String, nullable=False)
    is_standard: Mapped[bool] = mapped_column("isStandard", Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    plans: Mapped[list["Plan"]] = relationship(
        secondary=plan_exercise_association,
        back_populates="exercises",
        lazy="selectin"
    )

class Plan(Base):
    __tablename__ = "plan"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    day: Mapped[str] = mapped_column(ENUM(
            "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
            name="Day", 
            create_type=False
        ), nullable=False)
    
    user_id: Mapped[str] = mapped_column("userId", ForeignKey("user.id"), nullable=False)
    
    body_parts: Mapped[List[str]] = mapped_column("bodyParts", ARRAY(ENUM(
                "CHEST", "BACK", "LEGS", "SHOULDERS", "BICEPS", "TRICEPS", "CORE", "FULL_BODY",
                name="BodyPart",
                create_type=False
            )), nullable=False)
    
    created_at: Mapped[datetime] = mapped_column("createdAt", DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column("updatedAt", DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    user: Mapped["User"] = relationship(back_populates="plans")
    exercises: Mapped[list["Exercise"]] = relationship(
        secondary=plan_exercise_association,
        back_populates="plans",
        lazy="selectin"
    )