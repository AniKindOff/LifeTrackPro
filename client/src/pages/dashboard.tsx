import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HabitWidget from "@/components/dashboard/HabitWidget";
import FinanceWidget from "@/components/dashboard/FinanceWidget";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit, Expense } from "@shared/schema";
import { Card } from "@/components/ui/card";
import InsightsWidget from "@/components/dashboard/InsightsWidget";
import ActivityChartWidget from "@/components/dashboard/ActivityChartWidget";
import StreakWidget from "@/components/dashboard/StreakWidget";
import IconsShowcase from "@/components/dashboard/IconsShowcase";
import { Link } from "wouter";
import QuizButton from "@/components/gamification/QuizButton";

export default function Dashboard() {
  const habits = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: async () => {
      const response = await fetch("/api/habits");
      if (!response.ok) throw new Error("Failed to fetch habits");
      return response.json();
    },
  });

  const expenses = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await fetch("/api/expenses");
      if (!response.ok) throw new Error("Failed to fetch expenses");
      return response.json();
    },
  });

  if (habits.isLoading || expenses.isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your progress and manage your finances.</p>
        </div>

        <div className="mb-8">
          <IconsShowcase />
        </div>

        <div className="mb-8">
          <ActivityChartWidget />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <HabitWidget habits={habits.data || []} />
          </Card>

          <div className="space-y-6">
            <StreakWidget />
            <Card>
              <FinanceWidget expenses={expenses.data || []} />
            </Card>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/habits">
                <button className="w-full p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                  Add Habit
                </button>
              </Link>
              <Link href="/finances">
                <button className="w-full p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                  Log Expense
                </button>
              </Link>
              <div className="col-span-2">
                <QuizButton />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <InsightsWidget type="habits" />
            <InsightsWidget type="finances" />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="h-16 bg-primary/10 mb-8" />
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-48 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        
        <Skeleton className="h-[200px] w-full mb-8 rounded-lg" />
        
        <Skeleton className="h-[350px] w-full mb-8 rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-[200px] rounded-lg" />
            <Skeleton className="h-[200px] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}