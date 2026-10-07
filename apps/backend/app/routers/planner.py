from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_async_session
from app.models import User
from app.main import auth_backend, fastapi_users

router = APIRouter(prefix="/plans", tags=["plans"])

exercises_router = APIRouter(prefix="/exercises", tags=["exercises"])


class PlannerExercisePayload(BaseModel):
    id: Optional[str] = None
    name: str
    bodyPart: str


class PlannerPlanPayload(BaseModel):
    day: str = Field(..., min_length=1)
    bodyParts: List[str] = Field(default_factory=list)
    exercises: List[PlannerExercisePayload] = Field(default_factory=list)


class PlannerPlanResponse(BaseModel):
    id: str
    day: str
    bodyParts: List[str]
    exercises: List[dict]

class ExerciseResponse(BaseModel):
    id: str
    name: str
    bodyPart: str
    isStandard: bool

async def get_current_user(
    user: User = Depends(fastapi_users.current_user()),
):
    return user

@exercises_router.get("", response_model=List[ExerciseResponse])
async def list_exercises(
    session: AsyncSession = Depends(get_async_session),
):
    from app.models import Exercise

    # Fetch all exercises, optionally you could filter by standard/custom here later
    result = await session.execute(select(Exercise))
    exercises = result.scalars().all()

    return [
        {
            "id": ex.id,
            "name": ex.name,
            "bodyPart": ex.body_part,
            "isStandard": ex.is_standard,
        }
        for ex in exercises
    ]

@router.get("", response_model=List[PlannerPlanResponse])
async def list_plans(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    from app.models import Plan

    stmt = (
        select(Plan)
        .where(Plan.user_id == current_user.id)
        .options(selectinload(Plan.exercises))
    )
    result = await session.execute(stmt)
    plans = result.scalars().all()

    return [
        {
            "id": plan.id,
            "day": plan.day,
            "bodyParts": plan.body_parts,
            "exercises": [
                {"id": exercise.id, "name": exercise.name, "bodyPart": exercise.body_part}
                for exercise in plan.exercises
            ],
        }
        for plan in plans
    ]


@router.post("", response_model=PlannerPlanResponse)
async def create_plan(
    payload: PlannerPlanPayload,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    from app.models import Plan, Exercise

    if not payload.bodyParts:
        raise HTTPException(status_code=400, detail="At least one body part is required")
    if not payload.exercises:
        raise HTTPException(status_code=400, detail="At least one exercise is required")

    plan = await session.scalar(
        select(Plan).where(Plan.user_id == current_user.id, Plan.day == payload.day)
    )

    stmt = (
        select(Plan)
        .where(Plan.user_id == current_user.id, Plan.day == payload.day)
        .options(selectinload(Plan.exercises))
    )
    plan = await session.scalar(stmt)

    if plan is None:
        plan = Plan(user_id=current_user.id, day=payload.day, body_parts=payload.bodyParts)
        session.add(plan)
        await session.flush()
    else:
        plan.body_parts = payload.bodyParts

    resolved_exercises = []
    for exercise_payload in payload.exercises:
        exercise = await session.scalar(
            select(Exercise).where(Exercise.name == exercise_payload.name)
        )
        if exercise is None:
            # Upsert custom exercise if it doesn't exist in our seeded DB
            exercise = Exercise(
                name=exercise_payload.name,
                body_part=exercise_payload.bodyPart,
                is_standard=False,
            )
            session.add(exercise)
            await session.flush() # Flush to get the ID
            
        resolved_exercises.append(exercise)

    # Cleanly map the new relationship state
    plan.exercises = resolved_exercises

    await session.commit()
    await session.refresh(plan)

    return {
        "id": plan.id,
        "day": plan.day,
        "bodyParts": plan.body_parts,
        "exercises": [
            {"id": exercise.id, "name": exercise.name, "bodyPart": exercise.body_part}
            for exercise in plan.exercises
        ],
    }
