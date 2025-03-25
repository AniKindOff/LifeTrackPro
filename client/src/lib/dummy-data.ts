export const generateDummyData = () => {
  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  return {
    expenses: last30Days.map((date) => ({
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 1000) + 100,
      category: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills'][
        Math.floor(Math.random() * 5)
      ],
    })),

    habits: last30Days.map((date) => ({
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.3,
      streak: Math.floor(Math.random() * 7),
    })),

    budgets: [
      { category: 'Food', allocated: 5000, spent: 4200 },
      { category: 'Transport', allocated: 2000, spent: 1800 },
      { category: 'Entertainment', allocated: 3000, spent: 2500 },
      { category: 'Shopping', allocated: 4000, spent: 3500 },
      { category: 'Bills', allocated: 6000, spent: 5800 },
    ],

    monthlyStats: {
      totalExpenses: 17800,
      totalIncome: 25000,
      savings: 7200,
      habitCompletionRate: 85,
      topCategories: [
        { name: 'Food', amount: 4200, percentage: 23.6 },
        { name: 'Bills', amount: 5800, percentage: 32.6 },
        { name: 'Shopping', amount: 3500, percentage: 19.7 },
        { name: 'Entertainment', amount: 2500, percentage: 14 },
        { name: 'Transport', amount: 1800, percentage: 10.1 },
      ],
    },

    weeklyProgress: Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      habits: Math.floor(Math.random() * 5) + 1,
      expenses: Math.floor(Math.random() * 1000) + 500,
    })),

    notifications: [
      {
        id: 1,
        type: 'success',
        message: 'Daily reward earned! ₹10 added to your wallet.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'warning',
        message: "You're close to your monthly budget limit!",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        type: 'info',
        message: 'New habit streak achieved! Keep it up!',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  };
}; 