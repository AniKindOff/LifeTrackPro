import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Expense } from "@shared/schema";

interface FinanceWidgetProps {
  expenses: Expense[];
}

const COLORS = ['#2E5BFF', '#00C48C', '#FF6B6B', '#FFB800'];

export default function FinanceWidget({ expenses }: FinanceWidgetProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  const expensesByCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4">
          <p className="text-lg font-semibold">Total Expenses: ${totalExpenses.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
