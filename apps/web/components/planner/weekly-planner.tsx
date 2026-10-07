import { CalendarDays, Dumbbell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditDayDialog } from "@/components/planner/edit-day-dialog";
import { cn } from "@/lib/utils";
import type { ExerciseCatalogItem } from "@/lib/planner-data";

const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const dayLabels: Record<(typeof dayOrder)[number], string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

interface WeeklyPlannerProps {
  plans?: Array<{
    day: (typeof dayOrder)[number];
    bodyParts: string[];
    exercises: string[];
  }>;
  catalog: ExerciseCatalogItem[]; // Added catalog prop
}

export function WeeklyPlanner({ plans = [], catalog }: WeeklyPlannerProps) {
  const planMap = new Map(plans.map((plan) => [plan.day, plan]));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dayOrder.map((day) => {
        const plan = planMap.get(day);
        const bodyParts = plan?.bodyParts ?? ["FULL_BODY"];
        const exercises = plan?.exercises ?? [];

        return (
          <Card key={day} className={cn("border-border/70", "shadow-sm")}>
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{dayLabels[day]}</CardTitle>
                  <CardDescription>
                    Focus areas and exercise picks
                  </CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <CalendarDays className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {bodyParts.map((part) => (
                  <span
                    key={part}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    {part.replace("_", " ")}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                {exercises.length > 0 ? (
                  exercises.map((exercise) => (
                    <div
                      key={exercise}
                      className="flex items-center gap-2 rounded-md border border-border/70 bg-muted/20 px-3 py-2 text-sm"
                    >
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <span>{exercise}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No exercises assigned yet.
                  </p>
                )}
              </div>

              <EditDayDialog
                dayId={day}
                dayLabel={dayLabels[day]}
                bodyParts={bodyParts}
                exercises={exercises}
                catalog={catalog} // Passed down to the dialog
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
