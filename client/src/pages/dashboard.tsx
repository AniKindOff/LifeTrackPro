import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HabitWidget from "@/components/dashboard/HabitWidget";
import FinanceWidget from "@/components/dashboard/FinanceWidget";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit, Expense } from "@shared/schema";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const habits = useQuery<Habit[]>({ 
    queryKey: ["/api/habits"]
  });

  const expenses = useQuery<Expense[]>({
    queryKey: ["/api/expenses"]
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <HabitWidget habits={habits.data || []} />
          </Card>

          <Card>
            <FinanceWidget expenses={expenses.data || []} />
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                Add Habit
              </button>
              <button className="p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                Log Expense
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tips & Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pro tip: Track your habits daily for better results!
            </p>
          </Card>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}