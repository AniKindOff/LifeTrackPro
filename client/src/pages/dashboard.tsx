import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import HabitWidget from "@/components/dashboard/HabitWidget";
import FinanceWidget from "@/components/dashboard/FinanceWidget";
import { Skeleton } from "@/components/ui/skeleton";
import type { Habit, Expense } from "@shared/schema";

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
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HabitWidget habits={habits.data || []} />
          <FinanceWidget expenses={expenses.data || []} />
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 bg-primary/10 mb-8" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
