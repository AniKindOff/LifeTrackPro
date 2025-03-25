import { Challenge, Achievement, MiniGame } from '../types/gamification';

export const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Complete 3 tasks before 10 AM',
    progress: new Map([['completed', 2], ['total', 3]]),
    rewards: [
      {
        id: 'early-bird-reward',
        type: 'points',
        title: 'Early Bird',
        description: 'Complete 3 tasks before 10 AM',
        requirements: [],
        unlocked: false,
        value: 100,
      },
    ],
    participants: [],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    type: 'daily',
    duration: 1,
  },
  {
    id: '2',
    title: 'Task Master',
    description: 'Complete 10 high-priority tasks',
    progress: new Map([['completed', 7], ['total', 10]]),
    rewards: [
      {
        id: 'task-master-reward',
        type: 'points',
        title: 'Task Master',
        description: 'Complete 10 high-priority tasks',
        requirements: [],
        unlocked: false,
        value: 200,
      },
    ],
    participants: [],
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    type: 'weekly',
    duration: 7,
  },
];

export const sampleAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Productivity Pro',
    description: 'Complete 100 tasks',
    tier: 'gold',
    progress: 100,
    reward: {
      id: 'productivity-pro-reward',
      type: 'badge',
      title: 'Productivity Pro',
      description: 'Complete 100 tasks',
      requirements: [],
      unlocked: true,
      value: 500,
    },
    icon: '🏆',
    isHidden: false,
  },
  {
    id: '2',
    title: 'Health Champion',
    description: 'Track health metrics for 30 consecutive days',
    tier: 'platinum',
    progress: 0,
    reward: {
      id: 'health-champion-reward',
      type: 'badge',
      title: 'Health Champion',
      description: 'Track health metrics for 30 consecutive days',
      requirements: [],
      unlocked: false,
      value: 1000,
    },
    icon: '🌟',
    isHidden: false,
  },
];

export const sampleMiniGames: MiniGame[] = [
  {
    name: 'Focus Timer',
    type: 'focus',
    difficulty: 'easy',
    rewards: [
      {
        id: 'focus-timer-reward',
        type: 'points',
        title: 'Focus Timer Master',
        description: 'Complete the Focus Timer game',
        requirements: [],
        unlocked: false,
        value: 50,
      },
    ],
    timeLimit: 25,
    description: 'Stay focused for 25 minutes',
    isPremium: false,
  },
  {
    name: 'Task Sorting',
    type: 'puzzle',
    difficulty: 'medium',
    rewards: [
      {
        id: 'task-sorting-reward',
        type: 'points',
        title: 'Task Sorting Master',
        description: 'Complete the Task Sorting game',
        requirements: [],
        unlocked: false,
        value: 100,
      },
    ],
    timeLimit: 15,
    description: 'Sort tasks by priority as fast as possible',
    isPremium: false,
  },
]; 