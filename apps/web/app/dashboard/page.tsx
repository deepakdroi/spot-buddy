"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { differenceInYears } from "date-fns";

const muscleGroupData = [
  { subject: "Chest", sets: 12, fullMark: 20 },
  { subject: "Back", sets: 14, fullMark: 20 },
  { subject: "Shoulders", sets: 10, fullMark: 20 },
  { subject: "Legs", sets: 16, fullMark: 20 },
  { subject: "Arms", sets: 11, fullMark: 20 },
  { subject: "Core", sets: 9, fullMark: 20 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [age, setAge] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.dob) {
      const dob = new Date(session.user.dob);
      const calculatedAge = differenceInYears(new Date(), dob);
      setAge(calculatedAge);
      setIsLoading(false);
    }
  }, [session, status, router]);

  const handleStartWorkout = () => {
    toast({
      title: "Workout Started",
      description: "Get ready to crush your goals!",
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-96 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {session.user?.name}!
        </h1>
        <p className="text-muted-foreground">Here's your fitness dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Start Your Workout</CardTitle>
            <CardDescription>Begin a new workout session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartWorkout} className="w-full">
              Start Workout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent PRs</CardTitle>
            <CardDescription>Your personal records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-52" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Muscle Group Performance</CardTitle>
          <CardDescription>Sets completed per muscle group</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={muscleGroupData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 20]} />
              <Radar
                name="Sets"
                dataKey="sets"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
