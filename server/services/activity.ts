import { Habit, HabitLog, Expense } from "@shared/schema";

interface ActivityData {
  habits: {
    daily: Array<{ date: string; count: number }>;
    categories: Array<{ name: string; count: number }>;
  };
  finances: {
    spending: Array<{ date: string; amount: number }>;
    categories: Array<{ name: string; value: number }>;
  };
}

/**
 * Generate activity data for charts from user data
 */
export function generateActivityData(
  habits: Habit[],
  habitLogs: HabitLog[],
  expenses: Expense[]
): ActivityData {
  // Process habit data
  const habitCategories = new Map<string, number>();
  habits.forEach(habit => {
    // Using habit name instead of category since Habit doesn't have a category property
    const habitName = habit.name || 'Unnamed';
    habitCategories.set(
      habitName,
      (habitCategories.get(habitName) || 0) + 1
    );
  });

  // Process habit logs by date (last 7 days)
  const habitDailyMap = new Map<string, number>();
  const today = new Date();
  
  // Initialize the last 7 days with 0 counts
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);
    habitDailyMap.set(dateString, 0);
  }
  
  // Fill in actual log counts
  habitLogs.forEach(log => {
    const logDate = new Date(log.date);
    // Only include logs from the last 7 days
    if (isWithinLastNDays(logDate, today, 7)) {
      const dateString = formatDate(logDate);
      habitDailyMap.set(
        dateString,
        (habitDailyMap.get(dateString) || 0) + 1
      );
    }
  });

  // Process expense data by category
  const expenseCategories = new Map<string, number>();
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized';
    expenseCategories.set(
      category,
      (expenseCategories.get(category) || 0) + Number(expense.amount)
    );
  });

  // Process expense data by date (last 7 days)
  const expenseDailyMap = new Map<string, number>();
  
  // Initialize the last 7 days with 0 amounts
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = formatDate(date);
    expenseDailyMap.set(dateString, 0);
  }
  
  // Fill in actual expense amounts
  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    // Only include expenses from the last 7 days
    if (isWithinLastNDays(expenseDate, today, 7)) {
      const dateString = formatDate(expenseDate);
      expenseDailyMap.set(
        dateString,
        (expenseDailyMap.get(dateString) || 0) + Number(expense.amount)
      );
    }
  });

  return {
    habits: {
      daily: Array.from(habitDailyMap).map(([date, count]) => ({ date, count })),
      categories: Array.from(habitCategories).map(([name, count]) => ({ name, count }))
    },
    finances: {
      spending: Array.from(expenseDailyMap).map(([date, amount]) => ({ date, amount })),
      categories: Array.from(expenseCategories).map(([name, value]) => ({ name, value }))
    }
  };
}

// Helper function to format date as "MMM DD" (e.g. "Jun 15")
function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Helper function to check if a date is within the last N days
function isWithinLastNDays(date: Date, today: Date, days: number): boolean {
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < days;
} 