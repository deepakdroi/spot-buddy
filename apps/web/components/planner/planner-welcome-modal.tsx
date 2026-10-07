"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlannerWelcomeModalProps {
  open?: boolean;
}

export function PlannerWelcomeModal({
  open = false,
}: PlannerWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan your week in one place</DialogTitle>
          <DialogDescription>
            This planner gives you a simple seven-day layout for organizing your
            focus areas, then you can refine each day with exercises and body
            parts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
            Each day can hold a different focus, such as chest, back, legs, or
            recovery, and you can revisit any day whenever you want.
          </div>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Start Planning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
