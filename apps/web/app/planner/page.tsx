import { Suspense } from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { WeeklyPlanner } from "@/components/planner/weekly-planner";
import { PlannerWelcomeModal } from "@/components/planner/planner-welcome-modal";
import { getUserPlans, getExerciseCatalog } from "@/lib/planner-data"; // Updated import

export default async function PlannerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const accessToken = (session.user as { accessToken?: string }).accessToken;

  // Fetch both plans and the new exercise catalog in parallel
  const [plans, catalog] = await Promise.all([
    getUserPlans(accessToken),
    getExerciseCatalog(),
  ]);

  const hasPlans = plans.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Your Workout Planner</h1>
        <p className="text-muted-foreground">
          Build a seven-day blueprint that grows with your routine.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">
            Loading planner...
          </div>
        }
      >
        <WeeklyPlanner
          plans={plans.map((plan) => ({
            day: plan.day, // This is the raw "MONDAY"
            bodyParts: plan.bodyParts,
            exercises: plan.exercises.map((exercise) => exercise.name),
          }))}
          catalog={catalog} // Pass catalog down
        />
      </Suspense>

      {!hasPlans ? <PlannerWelcomeModal open /> : null}
    </div>
  );
}
