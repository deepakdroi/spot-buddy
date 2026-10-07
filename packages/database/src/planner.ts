import { PrismaClient, type BodyPart } from "@prisma/client";

export interface PlannerExercise {
  id: string;
  name: string;
  bodyPart: string;
}

export interface PlannerPlan {
  id: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  bodyParts: string[];
  exercises: PlannerExercise[];
}

const prisma = new PrismaClient();

export async function getUserPlans(userId: string): Promise<PlannerPlan[]> {
  const plans = await prisma.plan.findMany({
    where: { userId },
    select: {
      id: true,
      day: true,
      bodyParts: true,
      exercises: {
        select: {
          id: true,
          name: true,
          bodyPart: true,
        },
      },
    },
  });

  return plans.map((plan) => ({
    id: plan.id,
    day: plan.day,
    bodyParts: plan.bodyParts.map((part) => part),
    exercises: plan.exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
    })),
  }));
}

export async function getPlannerExerciseGroups(userId: string) {
  const plans = await getUserPlans(userId);
  const allExercises = plans.flatMap((plan) =>
    plan.exercises.map((exercise) => exercise.name),
  );
  const uniqueExercises = Array.from(new Set(allExercises));

  const recentExercises = uniqueExercises.slice(
    0,
    Math.min(3, uniqueExercises.length),
  );
  const otherExercises = uniqueExercises.filter(
    (exercise) => !recentExercises.includes(exercise),
  );

  return {
    recentExercises,
    otherExercises,
  };
}
