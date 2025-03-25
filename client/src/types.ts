// Task-related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  createdAt: string;
  category?: string;
}

// Goal-related types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  category?: string;
  tasks?: string[];
  completed: boolean;
  createdAt: string;
}

// Habit-related types
export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  reminder?: string;
  streak: number;
  completedDates: string[];
  createdAt: string;
  color?: string;
  icon?: string;
}

// Focus timer types
export interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  label?: string;
  completed: boolean;
  createdAt: string;
}

// Journal entry types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags?: string[];
  createdAt: string;
}

// Game types
export type GameLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameScore {
  gameType: string;
  level: GameLevel;
  score: number;
  date: string;
}

// User profile types
export interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
  theme?: string;
  language?: string;
  coinsEarned: number;
  level: number;
  experience: number;
  joinDate: string;
  achievements?: Achievement[];
  badges?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// Analytics types
export interface DailyStats {
  date: string;
  tasksCompleted: number;
  focusMinutes: number;
  habitCompletion: number;
  journalEntries: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  dailyStats: DailyStats[];
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  averageHabitCompletion: number;
  totalJournalEntries: number;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  focusSessionDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
} 