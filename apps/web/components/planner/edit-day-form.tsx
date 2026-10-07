"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SmartExerciseSelect } from "@/components/planner/smart-exercise-select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Added for UI refresh

const formSchema = z.object({
  day: z.string().min(1),
  bodyParts: z.array(z.string()).min(1, "Pick at least one focus area"),
  exercises: z.array(z.string()).min(1, "Choose at least one exercise"),
});

type FormValues = z.infer<typeof formSchema>;

// Ensure this matches the Prisma enums exactly
const BODY_PART_OPTIONS = [
  "CHEST",
  "BACK",
  "LEGS",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "CORE",
  "FULL_BODY",
];

interface EditDayFormProps {
  dayId: string;
  dayLabel: string;
  bodyParts: string[];
  exercises: string[];
  catalog: Array<{ name: string; bodyPart: string; isStandard: boolean }>; // The real catalog
  onSuccess?: () => void;
}

export function EditDayForm({
  dayId,
  dayLabel,
  bodyParts,
  exercises,
  catalog,
  onSuccess,
}: EditDayFormProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedExercises, setSelectedExercises] =
    useState<string[]>(exercises);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>(
    bodyParts[0] ?? "CHEST",
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: dayId, // Send the raw enum to the backend
      bodyParts,
      exercises,
    },
  });

  // Filter the real catalog based on the selected dropdown
  const standardExercises = useMemo(() => {
    return (catalog || [])
      .filter((ex) => ex.bodyPart === selectedBodyPart && ex.isStandard)
      .map((ex) => ex.name);
  }, [catalog, selectedBodyPart]);

  const allRelevantExercises = useMemo(() => {
    return (catalog || [])
      .filter((ex) => ex.bodyPart === selectedBodyPart)
      .map((ex) => ex.name);
  }, [catalog, selectedBodyPart]);

  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      void (async () => {
        if (!session?.user?.id) {
          toast({ title: "Not authenticated", variant: "destructive" });
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/plans`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session.user as any).accessToken || ""}`,
            },
            body: JSON.stringify({
              day: values.day, // "MONDAY"
              bodyParts: values.bodyParts,
              exercises: values.exercises.map((exerciseName) => ({
                name: exerciseName,
                bodyPart: selectedBodyPart, // Associates the exercise with the body part cleanly
              })),
            }),
          },
        );

        if (response.ok) {
          toast({
            title: "Plan updated",
            description: `${dayLabel} saved successfully.`,
          });
          router.refresh(); // Forces Next.js to re-fetch Server Components!
          onSuccess?.();
        } else {
          const errorBody = await response.json().catch(() => ({}));
          toast({
            title: "Unable to update plan",
            description: errorBody.detail || "Please try again.",
            variant: "destructive",
          });
        }
      })();
    });
  };
  console.log("Catalog received in form:", catalog);
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input readOnly value={dayLabel} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Body part focus</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedBodyPart}
          onChange={(event) => {
            const nextBodyPart = event.target.value;
            setSelectedBodyPart(nextBodyPart);
            form.setValue("bodyParts", [nextBodyPart], {
              shouldValidate: true,
            });
          }}
        >
          {BODY_PART_OPTIONS.map((part) => (
            <option key={part} value={part}>
              {part.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Exercises</label>
        <SmartExerciseSelect
          recentExercises={standardExercises} // Powered by the real DB now!
          otherExercises={allRelevantExercises}
          value={selectedExercises}
          onChange={(value) => {
            setSelectedExercises(value);
            form.setValue("exercises", value, { shouldValidate: true });
          }}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}
