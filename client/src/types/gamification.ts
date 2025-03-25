export interface UserProgress {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  achievements: Achievement[];
  lifeCoins: number;
  streak: number;
  lastActivityDate: string;
}

export interface Reward {
  id: string;
  type: 'badge' | 'points' | 'unlock' | 'theme';
  title: string;
  description: string;
  requirements: Requirement[];
  unlocked: boolean;
  value?: number;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  rewards: Reward[];
  participants: string[];
  progress: Map<string, number>;
  startDate: string;
  endDate: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'habit';
}

export interface MiniGame {
  name: string;
  type: 'focus' | 'memory' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: Reward[];
  timeLimit?: number;
  description: string;
  isPremium: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  reward: Reward;
  icon: string;
  isHidden: boolean;
}

export interface MotivationSystem {
  dailyQuotes: string[];
  streakBonuses: Map<number, Reward>;
  milestones: Milestone[];
  encouragements: string[];
}

export interface PremiumFeatures {
  customThemes: Theme[];
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  exclusiveGames: MiniGame[];
  specialBadges: Badge[];
}

export interface Theme {
  id: string;
  name: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  reward: Reward;
  date: string;
  completed: boolean;
}

export interface Requirement {
  type: 'task' | 'streak' | 'level' | 'achievement';
  value: number;
  description: string;
  completed: boolean;
} 