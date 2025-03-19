import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import HabitForm from "@/components/habits/HabitForm";
import type { Habit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Habits() {
  const { toast } = useToast();
  
  const habits = useQuery<Habit[]>({
    queryKey: ["/api/habits"]
  });

  const createHabit = useMutation({
    mutationFn: async (data: { name: string; frequency: string; target: number }) => {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create habit");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({ title: "Habit created successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive"
      });
    }
  });

  if (habits.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Habit Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Habit</h2>
          <HabitForm onSubmit={(data) => createHabit.mutate(data)} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
          {habits.data?.map(habit => (
            <div key={habit.id} className="p-4 border-b last:border-b-0">
              <h3 className="font-medium">{habit.name}</h3>
              <p className="text-sm text-muted-foreground">
                {habit.frequency} • Target: {habit.target}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
