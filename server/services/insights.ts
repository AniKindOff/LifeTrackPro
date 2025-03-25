import { GoogleGenerativeAI } from '@google/generative-ai';
import { Habit, Expense } from '@shared/schema';

// Create Gemini client with API key from environment or use a mock implementation
let genAI: GoogleGenerativeAI | null = null;
let geminiModel: any = null;

// Check if we have a valid API key
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('Gemini client initialized successfully in insights service');
  } catch (error) {
    console.warn('Failed to initialize Gemini client in insights service:', error);
  }
} else {
  console.info('No valid Gemini API key found, using mock implementations for insights');
}

export async function generateHabitInsights(habits: Habit[]): Promise<string> {
  try {
    if (!geminiModel) {
      console.log('Using mock habit insights');
      return "Based on your habits:\n" +
        "• You're doing well with consistency in daily habits\n" +
        "• Consider increasing your weekly goals gradually\n" +
        "• Try linking your habits to existing routines for better adherence\n" +
        "• Remember to celebrate small wins along the way!";
    }
    
    const habitSummary = habits.map(h => 
      `${h.name} (${h.frequency}, target: ${h.target}, current streak: ${h.streak})`
    ).join('\n');

    const result = await geminiModel.generateContent(`
      You are an AI habit analysis expert. Analyze the user's habits and provide actionable insights and suggestions for improvement. 
      Focus on motivation, consistency, and achievable goals.
      
      Analyze these habits and provide insights:
      ${habitSummary}
    `);
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating habit insights:', error);
    return "Could not analyze habits at this moment.";
  }
}

export async function generateFinanceInsights(expenses: Expense[]): Promise<string> {
  try {
    if (!geminiModel) {
      console.log('Using mock finance insights');
      return "Finance Analysis:\n" +
        "• Your top spending category could be optimized\n" +
        "• Consider setting a budget for discretionary expenses\n" +
        "• Look for subscriptions you might not be using\n" +
        "• Try the 50/30/20 rule for better financial balance";
    }
    
    const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const categorySummary = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);

    const expenseSummary = Object.entries(categorySummary)
      .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
      .join('\n');

    const result = await geminiModel.generateContent(`
      You are an AI financial advisor. Analyze spending patterns and provide practical money-saving tips and budget optimization suggestions. 
      Keep advice actionable and specific.
      
      Analyze these expenses:
      Total Spent: $${totalSpent.toFixed(2)}
      Breakdown by category:
      ${expenseSummary}
    `);
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating finance insights:', error);
    return "Could not analyze expenses at this moment.";
  }
}
