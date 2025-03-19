import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import ExpenseForm from "@/components/finances/ExpenseForm";
import type { Expense } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Finances() {
  const { toast } = useToast();
  
  const expenses = useQuery<Expense[]>({
    queryKey: ["/api/expenses"]
  });

  const createExpense = useMutation({
    mutationFn: async (data: { description: string; amount: number; category: string; date: Date }) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create expense");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({ title: "Expense added successfully" });
    },
    onError: () => {
      toast({ 
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  });

  if (expenses.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finance Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          <ExpenseForm onSubmit={(data) => createExpense.mutate(data)} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          {expenses.data?.map(expense => (
            <div key={expense.id} className="p-4 border-b last:border-b-0">
              <h3 className="font-medium">{expense.description}</h3>
              <p className="text-sm text-muted-foreground">
                ${expense.amount} • {expense.category}
              </p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
