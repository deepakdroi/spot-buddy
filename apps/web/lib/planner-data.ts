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

export async function getUserPlans(
  accessToken?: string,
): Promise<PlannerPlan[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${apiUrl}/plans`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data || []).map((plan: any) => ({
    id: plan.id,
    day: plan.day,
    bodyParts: plan.bodyParts || [],
    exercises: (plan.exercises || []).map((exercise: any) => ({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
    })),
  }));
}

export interface ExerciseCatalogItem {
  id: string;
  name: string;
  bodyPart: string;
  isStandard: boolean;
}

export async function getExerciseCatalog(): Promise<ExerciseCatalogItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${apiUrl}/exercises`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Backend error fetching exercises:", response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Next.js completely failed to reach FastAPI at ${apiUrl}. Error:`,
      error,
    );
    return [];
  }
}
