import OpenAI from 'openai';
import { Habit, Expense } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHabitInsights(habits: Habit[]): Promise<string> {
  try {
    const habitSummary = habits.map(h => 
      `${h.name} (${h.frequency}, target: ${h.target}, current streak: ${h.streak})`
    ).join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system" as const,
          content: "You are an AI habit analysis expert. Analyze the user's habits and provide actionable insights and suggestions for improvement. Focus on motivation, consistency, and achievable goals."
        },
        {
          role: "user" as const,
          content: `Analyze these habits and provide insights:\n${habitSummary}`
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    return completion.choices[0]?.message?.content || 
      "Unable to generate habit insights at this time.";
  } catch (error) {
    console.error('Error generating habit insights:', error);
    return "Could not analyze habits at this moment.";
  }
}

export async function generateFinanceInsights(expenses: Expense[]): Promise<string> {
  try {
    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const categorySummary = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    const expenseSummary = Object.entries(categorySummary)
      .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system" as const,
          content: "You are an AI financial advisor. Analyze spending patterns and provide practical money-saving tips and budget optimization suggestions. Keep advice actionable and specific."
        },
        {
          role: "user" as const,
          content: `Analyze these expenses:\nTotal Spent: $${totalSpent.toFixed(2)}\nBreakdown by category:\n${expenseSummary}`
        }
      ],
      temperature: 0.7,
      max_tokens: 250
    });

    return completion.choices[0]?.message?.content || 
      "Unable to generate financial insights at this time.";
  } catch (error) {
    console.error('Error generating finance insights:', error);
    return "Could not analyze expenses at this moment.";
  }
}
