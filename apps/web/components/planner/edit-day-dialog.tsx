"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditDayForm } from "@/components/planner/edit-day-form";
import type { ExerciseCatalogItem } from "@/lib/planner-data";

interface EditDayDialogProps {
  dayId: string;
  dayLabel: string;
  bodyParts: string[];
  exercises: string[];
  catalog: ExerciseCatalogItem[]; // Added catalog prop
}

export function EditDayDialog({
  dayId,
  dayLabel,
  bodyParts,
  exercises,
  catalog,
}: EditDayDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Day
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {dayLabel}</DialogTitle>
        </DialogHeader>
        <EditDayForm
          dayId={dayId}
          dayLabel={dayLabel}
          bodyParts={bodyParts}
          exercises={exercises}
          catalog={catalog}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
