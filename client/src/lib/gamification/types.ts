export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
  category: 'finance' | 'habits' | 'budget' | 'social' | 'learning';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: {
    xp: number;
    coins: number;
  };
}

export interface Level {
  current: number;
  xp: number;
  nextLevelXp: number;
  title: string;
}

export interface UserStats {
  totalXp: number;
  coins: number;
  level: Level;
  achievements: Achievement[];
  streakDays: number;
  longestStreak: number;
  tasksCompleted: number;
  habitsFormed: number;
  savingsGoalsReached: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    xp: number;
    coins: number;
    achievement?: string;
  };
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt: string;
} 