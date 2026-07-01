"""Schemas for API requests and responses"""
from fastapi_users import schemas
from datetime import datetime
from pydantic import field_validator


class UserRead(schemas.BaseUser[str]):
    name: str
    dob: datetime


class UserCreate(schemas.BaseUserCreate):
    name: str
    dob: datetime

    @field_validator('dob')
    @classmethod
    def strip_timezone(cls, v: datetime) -> datetime:
        if v.tzinfo is not None:
            return v.replace(tzinfo=None)
        return v


class UserUpdate(schemas.BaseUserCreate):
    name: str | None = None
    dob: datetime | None = None
