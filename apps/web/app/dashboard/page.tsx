import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardEmptyState } from "@/components/planner/dashboard-empty-state";
import { getUserPlans } from "@/lib/planner-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const accessToken = (session.user as { accessToken?: string }).accessToken;
  const plans = await getUserPlans(accessToken);
  const hasPlans = plans.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">
          Welcome back, {session.user?.name || "Spot Buddy"}!
        </h1>
        <p className="text-muted-foreground">
          Your training blueprint is waiting for the first move.
        </p>
      </div>

      {!hasPlans ? (
        <DashboardEmptyState />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Workout planner</CardTitle>
            <CardDescription>
              You already have a plan structure in place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/planner">Open planner</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
