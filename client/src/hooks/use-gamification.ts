import { useState, useEffect } from 'react';
import { Achievement, Level, UserStats, Challenge } from '@/lib/gamification/types';

const INITIAL_LEVEL: Level = {
  current: 1,
  xp: 0,
  nextLevelXp: 100,
  title: 'Novice Tracker'
};

const LEVEL_TITLES = [
  'Novice Tracker',
  'Habit Explorer',
  'Budget Master',
  'Savings Sage',
  'Finance Warrior',
  'Wealth Architect',
  'Money Maven',
  'Prosperity Pioneer',
  'Financial Virtuoso',
  'Life Mastery Legend'
];

const calculateLevel = (xp: number): Level => {
  const level = Math.floor(xp / 100) + 1;
  return {
    current: level,
    xp: xp,
    nextLevelXp: level * 100,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  };
};

export const useGamification = () => {
  const [stats, setStats] = useState<UserStats>({
    totalXp: 0,
    coins: 0,
    level: INITIAL_LEVEL,
    achievements: [],
    streakDays: 0,
    longestStreak: 0,
    tasksCompleted: 0,
    habitsFormed: 0,
    savingsGoalsReached: 0
  });

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    // Load saved stats from localStorage
    const savedStats = localStorage.getItem('user_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    generateDailyChallenges();
  }, []);

  const generateDailyChallenges = () => {
    const dailyChallenges: Challenge[] = [
      {
        id: 'daily-1',
        title: 'Morning Momentum',
        description: 'Complete 3 tasks before noon',
        category: 'daily',
        difficulty: 'easy',
        reward: {
          xp: 50,
          coins: 25
        },
        progress: 0,
        maxProgress: 3,
        completed: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      },
      {
        id: 'daily-2',
        title: 'Budget Guardian',
        description: 'Stay under budget in all categories today',
        category: 'daily',
        difficulty: 'medium',
        reward: {
          xp: 75,
          coins: 50
        },
        progress: 0,
        maxProgress: 1,
        completed: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      },
      {
        id: 'daily-3',
        title: 'Savings Hero',
        description: 'Save ₹100 or more today',
        category: 'daily',
        difficulty: 'hard',
        reward: {
          xp: 100,
          coins: 75,
          achievement: 'savings_master'
        },
        progress: 0,
        maxProgress: 1,
        completed: false,
        expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
      }
    ];

    setChallenges(dailyChallenges);
  };

  const addXp = (amount: number) => {
    const currentLevel = stats.level.current;
    const newXp = stats.totalXp + amount;
    const newLevel = calculateLevel(newXp);

    if (newLevel.current > currentLevel) {
      setShowLevelUp(true);
      // Add level up rewards
      addCoins(newLevel.current * 100);
    }

    setStats(prev => ({
      ...prev,
      totalXp: newXp,
      level: newLevel
    }));

    localStorage.setItem('user_stats', JSON.stringify({
      ...stats,
      totalXp: newXp,
      level: newLevel
    }));
  };

  const addCoins = (amount: number) => {
    setStats(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));

    localStorage.setItem('user_stats', JSON.stringify({
      ...stats,
      coins: stats.coins + amount
    }));
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      addXp(challenge.reward.xp);
      addCoins(challenge.reward.coins);

      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId ? { ...c, completed: true } : c
        )
      );
    }
  };

  const updateProgress = (challengeId: string, progress: number) => {
    setChallenges(prev =>
      prev.map(c =>
        c.id === challengeId
          ? {
              ...c,
              progress: Math.min(progress, c.maxProgress),
              completed: progress >= c.maxProgress
            }
          : c
      )
    );
  };

  return {
    stats,
    challenges,
    showLevelUp,
    setShowLevelUp,
    addXp,
    addCoins,
    completeChallenge,
    updateProgress
  };
}; 