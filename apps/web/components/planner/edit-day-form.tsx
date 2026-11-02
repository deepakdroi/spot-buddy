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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  day: z.string().min(1),
  bodyParts: z.array(z.string()).min(1, "Pick at least one focus area"),
  exercises: z.array(z.string()).min(1, "Choose at least one exercise"),
});

type FormValues = z.infer<typeof formSchema>;

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
  catalog: Array<{ name: string; bodyPart: string; isStandard: boolean }>;
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
      day: dayId,
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
        const token = (session?.user as any)?.accessToken;
        if (!session?.user?.id || !token) {
          toast({
            title: "Session Expired",
            description:
              "Please log out and log back in to refresh your token.",
            variant: "destructive",
          });
          console.error("Auth Error: Missing user ID or Access Token");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/plans`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              day: values.day,
              bodyParts: values.bodyParts,
              exercises: values.exercises.map((exerciseName) => ({
                name: exerciseName,
                bodyPart: selectedBodyPart,
              })),
            }),
          },
        );

        if (response.ok) {
          toast({
            title: "Plan updated",
            description: `${dayLabel} saved successfully.`,
          });
          router.refresh();
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
          recentExercises={standardExercises}
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
