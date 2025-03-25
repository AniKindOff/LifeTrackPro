// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const staticDir = path.join(rootDir, 'static-export');
const publicDir = path.join(rootDir, 'public');
const apiDir = path.join(staticDir, 'api');

// Create necessary directories
console.log('Creating API directory structure...');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Copy public assets to static directory
console.log('Copying public assets...');
if (fs.existsSync(publicDir)) {
  copyDirectory(publicDir, staticDir);
}

// Create mock API data
console.log('Generating mock API responses...');

// Create mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'light',
    notifications: true,
    language: 'en'
  }
};

// Create mock habits data
const mockHabits = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: 'Practice mindfulness for 10 minutes',
    frequency: 'daily',
    streak: 5,
    completed: true,
    goal: 30,
    createdAt: '2023-10-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'Exercise',
    description: 'Go for a 30-minute run or workout',
    frequency: 'daily',
    streak: 3,
    completed: false,
    goal: 90,
    createdAt: '2023-09-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Reading',
    description: 'Read for 20 minutes before bed',
    frequency: 'daily',
    streak: 7,
    completed: true,
    goal: 100,
    createdAt: '2023-08-20T22:00:00Z'
  }
];

// Create mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    description: 'Finish the draft and send for review',
    dueDate: '2023-11-15T17:00:00Z',
    priority: 'high',
    completed: false,
    category: 'work'
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    description: 'Buy ingredients for the week',
    dueDate: '2023-11-10T12:00:00Z',
    priority: 'medium',
    completed: true,
    category: 'personal'
  },
  {
    id: '3',
    title: 'Schedule Dentist Appointment',
    description: 'Call the office for a checkup',
    dueDate: '2023-11-20T09:00:00Z',
    priority: 'low',
    completed: false,
    category: 'health'
  }
];

// Create mock finances data
const mockFinances = {
  expenses: [
    {
      id: '1',
      description: 'Groceries',
      amount: 75.23,
      date: '2023-11-05T14:30:00Z',
      category: 'Food'
    },
    {
      id: '2',
      description: 'Internet Bill',
      amount: 59.99,
      date: '2023-11-01T09:00:00Z',
      category: 'Utilities'
    },
    {
      id: '3',
      description: 'Movie Tickets',
      amount: 25.50,
      date: '2023-11-07T19:15:00Z',
      category: 'Entertainment'
    }
  ],
  budgets: [
    {
      id: '1',
      category: 'Food',
      limit: 400,
      current: 250.75
    },
    {
      id: '2',
      category: 'Entertainment',
      limit: 150,
      current: 85.50
    },
    {
      id: '3',
      category: 'Utilities',
      limit: 300,
      current: 225.65
    }
  ]
};

// Create mock analytics data
const mockAnalytics = {
  habits: {
    completionRate: 78,
    mostConsistent: 'Reading',
    leastConsistent: 'Exercise',
    weeklyProgress: [65, 70, 75, 80, 85, 80, 78]
  },
  finances: {
    spendingByCategory: [
      { category: 'Food', amount: 450.25 },
      { category: 'Transportation', amount: 225.50 },
      { category: 'Entertainment', amount: 150.75 },
      { category: 'Utilities', amount: 300.00 },
      { category: 'Savings', amount: 500.00 }
    ],
    monthlyTrend: [1250, 1300, 1450, 1275, 1325, 1400]
  }
};

// Create mock chat messages
const mockChatMessages = [
  {
    id: '1',
    content: 'How can I set up a new habit?',
    sender: 'user',
    timestamp: '2023-11-08T10:15:00Z'
  },
  {
    id: '2',
    content: 'To create a new habit, go to the Habits section and click the "Add Habit" button. Fill in the details like name, description, frequency, and goal.',
    sender: 'assistant',
    timestamp: '2023-11-08T10:15:30Z'
  },
  {
    id: '3',
    content: 'How do I track my expenses?',
    sender: 'user',
    timestamp: '2023-11-08T10:20:00Z'
  },
  {
    id: '4',
    content: 'You can track expenses in the Finances section. Click on "Add Expense" and enter the details like amount, category, and date.',
    sender: 'assistant',
    timestamp: '2023-11-08T10:20:30Z'
  }
];

// Write mock data to API directory
writeJsonToFile(path.join(apiDir, 'user.json'), mockUser);
writeJsonToFile(path.join(apiDir, 'habits.json'), mockHabits);
writeJsonToFile(path.join(apiDir, 'tasks.json'), mockTasks);
writeJsonToFile(path.join(apiDir, 'finances.json'), mockFinances);
writeJsonToFile(path.join(apiDir, 'analytics.json'), mockAnalytics);
writeJsonToFile(path.join(apiDir, 'chat.json'), mockChatMessages);

// Create an index route for the API
const indexRoutes = {
  routes: [
    { path: '/api/user', description: 'User data' },
    { path: '/api/habits', description: 'Habits data' },
    { path: '/api/tasks', description: 'Tasks data' },
    { path: '/api/finances', description: 'Finances data' },
    { path: '/api/analytics', description: 'Analytics data' },
    { path: '/api/chat', description: 'Chat messages' }
  ]
};

writeJsonToFile(path.join(apiDir, 'index.json'), indexRoutes);

// Create a _redirects file for Netlify
fs.writeFileSync(
  path.join(staticDir, '_redirects'),
  '/*    /index.html   200\n'
);

// Create a simple netlify.toml for configuration
fs.writeFileSync(
  path.join(rootDir, 'netlify.toml'),
  `[build]
  publish = "static-export"
  command = "npm run export"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`
);

console.log('✅ Static export prepared successfully!');
console.log('To serve locally: npm run serve:static');
console.log('To deploy to Netlify: npm run deploy:netlify');

/**
 * Helper function to write JSON to file
 * @param {string} filePath - Path to write file
 * @param {any} data - Data to write
 */
function writeJsonToFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Created: ${path.relative(rootDir, filePath)}`);
}

/**
 * Helper function to copy a directory recursively
 * @param {string} source - Source directory
 * @param {string} destination - Destination directory
 */
function copyDirectory(source, destination) {
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourceFilePath = path.join(source, file);
    const destFilePath = path.join(destination, file);
    
    const stats = fs.statSync(sourceFilePath);
    
    if (stats.isDirectory()) {
      if (!fs.existsSync(destFilePath)) {
        fs.mkdirSync(destFilePath, { recursive: true });
      }
      copyDirectory(sourceFilePath, destFilePath);
    } else {
      fs.copyFileSync(sourceFilePath, destFilePath);
    }
  });
} 