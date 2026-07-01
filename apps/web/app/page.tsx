"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Welcome to Spot Buddy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your ultimate fitness tracking companion. Track your workouts,
            visualize your progress, and achieve your goals.
          </p>
          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-md p-6 border border-border">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>✓ Track your personal records</li>
                <li>✓ Visualize progress with charts</li>
                <li>✓ Monitor workout history</li>
                <li>✓ Secure authentication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
