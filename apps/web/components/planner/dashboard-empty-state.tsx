import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardEmptyStateProps {
  className?: string;
}

export function DashboardEmptyState({ className }: DashboardEmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Start your first blueprint</CardTitle>
            <CardDescription>
              Create a seven-day workout plan and build momentum from day one.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/planner">Create Your First Workout Plan</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
