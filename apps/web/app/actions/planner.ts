"use server";

import { revalidatePath } from "next/cache";

export interface PlannerFormValues {
  day: string;
  bodyParts: string[];
  exercises: string[];
}

export async function updateDayPlan(values: PlannerFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  revalidatePath("/planner");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `${values.day} plan updated successfully.`,
  };
}
