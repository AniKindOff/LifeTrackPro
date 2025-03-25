interface SearchParams {
  searchTerm: string;
}

// Mock web search function that returns simulated search results
export async function webSearch({ searchTerm }: SearchParams): Promise<string> {
  // This is a mock implementation of web search
  const searchTermLower = searchTerm.toLowerCase();
  
  if (searchTermLower.includes('productivity')) {
    return `
1. **The Pomodoro Technique**: Work for 25 minutes, then take a 5-minute break. After four cycles, take a longer break.
2. **Time Blocking**: Schedule specific time blocks for tasks to maintain focus and prevent multitasking.
3. **Two-minute Rule**: If a task takes less than two minutes, do it immediately instead of scheduling it for later.
4. **Eisenhower Matrix**: Prioritize tasks by urgency and importance to focus on what matters most.
5. **Digital Detox**: Schedule periods without digital distractions to improve focus and mental clarity.

Source: productivitycenter.org`;
  }
  
  if (searchTermLower.includes('finance') || searchTermLower.includes('money')) {
    return `
1. **50/30/20 Rule**: Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.
2. **Emergency Fund**: Build a fund covering 3-6 months of expenses before investing in higher-risk options.
3. **Debt Snowball Method**: Pay off smallest debts first for psychological wins, then tackle larger ones.
4. **Pay Yourself First**: Automatically direct a portion of each paycheck to savings before other expenses.
5. **Index Fund Investing**: Consider low-cost index funds for long-term wealth building with minimal effort.

Source: personalfinance.org`;
  }
  
  if (searchTermLower.includes('health') || searchTermLower.includes('fitness')) {
    return `
1. **Move Every Hour**: Take a short walk or do simple stretches to counteract sedentary behavior.
2. **HIIT Workouts**: High-intensity interval training provides efficient exercise in minimal time.
3. **Sleep Hygiene**: Maintain consistent sleep/wake times and limit screen use before bedtime.
4. **80/20 Nutrition Rule**: Focus on nutritious foods 80% of the time while allowing flexibility 20% of the time.
5. **Mind-Body Practices**: Incorporate meditation, yoga, or deep breathing to manage stress levels.

Source: healthguide.com`;
  }
  
  if (searchTermLower.includes('book') || searchTermLower.includes('read')) {
    return `
1. **Deep Work** by Cal Newport - Learn how to focus without distraction on a cognitively demanding task.
2. **Atomic Habits** by James Clear - Build good habits and break bad ones with small, incremental changes.
3. **The 7 Habits of Highly Effective People** by Stephen Covey - A principle-centered approach to problem-solving.
4. **Getting Things Done** by David Allen - A productivity methodology focused on capturing, clarifying, and organizing tasks.
5. **Mindset** by Carol Dweck - Understand the difference between fixed and growth mindsets for personal development.

Source: goodreads.com`;
  }
  
  // Default response for other search terms
  return `I found some interesting results for "${searchTerm}", but they appear to be general in nature. Try specifying your search with more keywords like "productivity tips", "financial advice", "health recommendations", or "books to read".`;
} 