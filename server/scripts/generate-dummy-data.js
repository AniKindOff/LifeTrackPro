/**
 * Script to generate dummy data for the LifeTrackPro application
 * Run with: node server/scripts/generate-dummy-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility to generate random dates between start and end
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Create a date string in ISO format
function formatDate(date) {
  return date.toISOString();
}

// Generate a random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a random item from an array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate dummy user
function generateUser() {
  const currentDate = new Date();
  return {
    id: 1,
    username: 'DemoUser',
    email: 'demo@example.com',
    password: '$2b$10$dummyhashedpassword', // This is a dummy hashed password
    avatar: null,
    theme: 'system',
    streak: 12, // 12-day streak
    lastLogin: formatDate(currentDate),
    createdAt: formatDate(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)) // created 30 days ago
  };
}

// Generate dummy habits with meaningful patterns
function generateHabits() {
  const habitTemplates = [
    {
      name: 'Morning Meditation',
      description: 'Start the day with 10 minutes of meditation',
      frequency: 'daily',
      target: 1,
      streak: 7
    },
    {
      name: 'Read Books',
      description: 'Read for personal development',
      frequency: 'daily',
      target: 30, // minutes
      streak: 5
    },
    {
      name: 'Exercise',
      description: 'Cardio or strength training',
      frequency: 'weekly',
      target: 3, // times per week
      streak: 3
    },
    {
      name: 'Drink Water',
      description: 'Stay hydrated throughout the day',
      frequency: 'daily',
      target: 8, // glasses
      streak: 12
    },
    {
      name: 'Learn Programming',
      description: 'Study programming concepts',
      frequency: 'daily',
      target: 60, // minutes
      streak: 9
    },
    {
      name: 'Weekly Planning',
      description: 'Plan the week ahead',
      frequency: 'weekly',
      target: 1,
      streak: 4
    },
    {
      name: 'Gratitude Journal',
      description: 'Write down three things you are grateful for',
      frequency: 'daily',
      target: 1,
      streak: 10
    },
    {
      name: 'No Social Media',
      description: 'Limit social media use',
      frequency: 'daily',
      target: 1,
      streak: 2
    }
  ];

  return habitTemplates.map((habit, index) => ({
    id: index + 1,
    userId: 1,
    ...habit,
    isArchived: false
  }));
}

// Generate habit logs that show realistic completion patterns
function generateHabitLogs(habits) {
  const logs = [];
  const now = new Date();
  let logId = 1;

  // For each habit, generate logs for the past 30 days
  habits.forEach(habit => {
    // For daily habits
    if (habit.frequency === 'daily') {
      // Generate consistent logs for the streak days
      for (let i = 0; i < habit.streak; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Add completed log
        logs.push({
          id: logId++,
          habitId: habit.id,
          date: formatDate(date).substring(0, 10), // Just keep YYYY-MM-DD
          value: habit.target // Successfully met target
        });
      }

      // Add some inconsistent logs before the streak (showing some missed days)
      for (let i = habit.streak; i < 30; i++) {
        // 60% chance of completing the habit
        if (Math.random() < 0.6) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          // Add completed log, sometimes exceeding target
          logs.push({
            id: logId++,
            habitId: habit.id,
            date: formatDate(date).substring(0, 10),
            value: Math.random() < 0.2 ? habit.target + randomInt(1, 3) : habit.target
          });
        }
        // Otherwise, day was missed (no log)
      }
    }
    // For weekly habits
    else if (habit.frequency === 'weekly') {
      // Create logs for each week
      for (let week = 0; week < 5; week++) { // 5 weeks history
        const weeklyTarget = habit.target;
        let completed = 0;

        // For the weeks in the streak, complete target
        if (week < habit.streak) {
          completed = weeklyTarget;
        } 
        // For weeks before the streak, show variable completion
        else {
          completed = Math.random() < 0.7 ? weeklyTarget : randomInt(0, weeklyTarget - 1);
        }

        // Add logs for each completion within the week
        for (let i = 0; i < completed; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - (week * 7 + randomInt(0, 6))); // Random day in the week
          
          logs.push({
            id: logId++,
            habitId: habit.id,
            date: formatDate(date).substring(0, 10),
            value: 1 // Each completion counts as 1 toward weekly target
          });
        }
      }
    }
  });

  return logs;
}

// Generate financial data
function generateExpenses() {
  const expenseCategories = [
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Entertainment',
    'Housing',
    'Utilities',
    'Healthcare',
    'Personal',
    'Education',
    'Shopping',
    'Travel'
  ];

  const expenses = [];
  const now = new Date();
  
  // Generate 50 expenses
  for (let i = 1; i <= 50; i++) {
    // Random date within past 60 days
    const date = new Date(now);
    date.setDate(date.getDate() - randomInt(0, 60));
    
    const category = randomItem(expenseCategories);
    
    // Generate realistic amounts based on category
    let amount;
    switch (category) {
      case 'Food & Dining':
        amount = randomInt(8, 50);
        break;
      case 'Groceries':
        amount = randomInt(20, 150);
        break;
      case 'Transportation':
        amount = randomInt(5, 70);
        break;
      case 'Entertainment':
        amount = randomInt(10, 100);
        break;
      case 'Housing':
        amount = randomInt(500, 2000);
        break;
      case 'Utilities':
        amount = randomInt(30, 200);
        break;
      case 'Healthcare':
        amount = randomInt(15, 300);
        break;
      case 'Personal':
        amount = randomInt(10, 100);
        break;
      case 'Education':
        amount = randomInt(20, 500);
        break;
      case 'Shopping':
        amount = randomInt(15, 200);
        break;
      case 'Travel':
        amount = randomInt(100, 1000);
        break;
      default:
        amount = randomInt(10, 100);
    }
    
    expenses.push({
      id: i,
      userId: 1,
      description: `${category} expense`,
      amount: amount.toString(), // Stored as string in our schema
      category,
      date: formatDate(date).substring(0, 10) // YYYY-MM-DD
    });
  }
  
  return expenses;
}

// Generate budgets
function generateBudgets() {
  return [
    {
      id: 1,
      userId: 1,
      category: 'Food & Dining',
      amount: '400.00',
      period: 'monthly'
    },
    {
      id: 2,
      userId: 1,
      category: 'Entertainment',
      amount: '200.00',
      period: 'monthly'
    },
    {
      id: 3,
      userId: 1,
      category: 'Transportation',
      amount: '300.00',
      period: 'monthly'
    },
    {
      id: 4,
      userId: 1,
      category: 'Shopping',
      amount: '250.00',
      period: 'monthly'
    }
  ];
}

// Generate chatbot conversation
function generateChatMessages() {
  const messages = [];
  const now = new Date();
  let id = 1;

  // Generate a conversation over multiple days
  for (let daysAgo = 30; daysAgo >= 0; daysAgo -= randomInt(3, 7)) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    // User message
    messages.push({
      id: id++,
      userId: 1,
      role: 'user',
      content: randomItem([
        "How am I doing with my morning meditation habit?",
        "What's my biggest expense category this month?",
        "Can you suggest a new habit for me to build?",
        "How can I improve my workout routine?",
        "I'm struggling with my reading habit. Any advice?",
        "What's my progress on my financial goals?",
        "How can I maintain my current streak?",
        "I need motivation to keep going with my habits."
      ]),
      timestamp: formatDate(date),
      language: 'en'
    });
    
    // Assistant response (a few seconds later)
    date.setSeconds(date.getSeconds() + randomInt(2, 10));
    messages.push({
      id: id++,
      userId: 1,
      role: 'assistant',
      content: randomItem([
        "You're doing great with your meditation habit! You've maintained a streak of 7 days, which is impressive. Keep the momentum going! 🧘",
        "Your biggest expense category this month is 'Food & Dining' at $237. This is slightly above your budget of $200. Perhaps you could cook at home more often?",
        "Based on your current habits, I'd suggest adding a hydration habit. Drinking enough water has numerous benefits for focus and energy!",
        "Your workout consistency has improved by 15% compared to last month. Consider adding one strength training session per week to balance your routine.",
        "For your reading habit, try breaking it down into smaller chunks - even just 10 minutes a day can help maintain the habit. Maybe set a specific time each day?",
        "You're currently 87% toward your savings goal this month. Great progress! Keep an eye on your entertainment spending to stay on track.",
        "To maintain your streak, set daily reminders and create visible cues in your environment. Your current 12-day streak is something to be proud of!",
        "Remember why you started these habits - they align with your goals of better health and financial freedom. Each day you maintain them is a step toward those goals!"
      ]),
      timestamp: formatDate(date),
      language: 'en'
    });
  }
  
  return messages;
}

// Generate notifications
function generateNotifications() {
  const notifications = [];
  const now = new Date();
  
  // Streak milestone notifications
  [3, 7, 10].forEach((streak, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (10 - streak)); // Space them out over time
    
    notifications.push({
      id: index + 1,
      userId: 1,
      type: 'streak',
      title: `${streak} Day Streak!`,
      message: `Congratulations! You've maintained your streak for ${streak} days. Keep up the great work!`,
      isRead: streak < 10, // Most recent one unread
      createdAt: formatDate(date)
    });
  });
  
  // Habit achievement notifications
  const habitAchievements = [
    {
      title: 'Meditation Milestone',
      message: 'You\'ve completed your meditation habit 30 times! Your mind thanks you.'
    },
    {
      title: 'Reading Goal Reached',
      message: 'You\'ve read for 15 hours this month. Knowledge is power!'
    },
    {
      title: 'Exercise Champion',
      message: 'You\'ve exercised 12 times in the past month. Your body is getting stronger!'
    }
  ];
  
  habitAchievements.forEach((achievement, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - randomInt(1, 20));
    
    notifications.push({
      id: 4 + index,
      userId: 1,
      type: 'habit',
      title: achievement.title,
      message: achievement.message,
      isRead: Math.random() > 0.3, // 70% chance of being read
      createdAt: formatDate(date)
    });
  });
  
  // Budget notifications
  const budgetNotifications = [
    {
      title: 'Budget Alert: Food & Dining',
      message: 'You\'ve reached 90% of your Food & Dining budget for this month.'
    },
    {
      title: 'Budget Success: Transportation',
      message: 'You stayed under your Transportation budget last month by $45!'
    }
  ];
  
  budgetNotifications.forEach((notification, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - randomInt(1, 15));
    
    notifications.push({
      id: 7 + index,
      userId: 1,
      type: 'budget',
      title: notification.title,
      message: notification.message,
      isRead: Math.random() > 0.5, // 50% chance of being read
      createdAt: formatDate(date)
    });
  });
  
  return notifications;
}

// Main function to generate all data
function generateDummyData() {
  const user = generateUser();
  const habits = generateHabits();
  const habitLogs = generateHabitLogs(habits);
  const expenses = generateExpenses();
  const budgets = generateBudgets();
  const chatMessages = generateChatMessages();
  const notifications = generateNotifications();
  
  // Create the full data object
  const dummyData = {
    users: [user],
    habits,
    habitLogs,
    expenses,
    budgets,
    chatMessages,
    notifications
  };
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write data to file
  fs.writeFileSync(
    path.join(dataDir, 'dummy-data.json'),
    JSON.stringify(dummyData, null, 2)
  );
  
  console.log('Dummy data has been generated and saved to server/data/dummy-data.json');
  console.log('Stats:');
  console.log(`- Users: ${dummyData.users.length}`);
  console.log(`- Habits: ${dummyData.habits.length}`);
  console.log(`- Habit Logs: ${dummyData.habitLogs.length}`);
  console.log(`- Expenses: ${dummyData.expenses.length}`);
  console.log(`- Budgets: ${dummyData.budgets.length}`);
  console.log(`- Chat Messages: ${dummyData.chatMessages.length}`);
  console.log(`- Notifications: ${dummyData.notifications.length}`);
}

// Run the generation
generateDummyData(); 