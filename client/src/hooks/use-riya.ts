import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { playSound } from '@/lib/sound-manager';

// Define the quote structure
interface Quote {
  text: string;
  author: string;
  category?: string;
}

// Message interface for chat history
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
}

// Daily quote data
const quotes: Quote[] = [
  {
    text: "पैसा कमाना मुश्किल है, बचाना उससे भी मुश्किल।",
    author: "Unknown",
    category: "Finance"
  },
  {
    text: "छोटी-छोटी बचत, बड़ी समृद्धि की ओर ले जाती है।",
    author: "Unknown",
    category: "Savings"
  },
  {
    text: "अच्छी आदतें सफलता की नींव हैं।",
    author: "Unknown",
    category: "Habits"
  },
  {
    text: "हर दिन एक नई शुरुआत है।",
    author: "Unknown",
    category: "Motivation"
  },
  {
    text: "समय और पैसा दोनों का सदुपयोग करें।",
    author: "Unknown",
    category: "Finance"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "Action"
  },
  {
    text: "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt",
    category: "Life"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Planning"
  }
];

// Daily challenges
const challenges = [
  "Complete 3 tasks today",
  "Track all your expenses for the day",
  "Create a budget for the next month",
  "Set a new financial goal",
  "Review your spending habits",
  "Meditate for 10 minutes",
  "Learn something new today",
  "Take a break and go for a walk"
];

interface RiyaState {
  coinsEarned: number;
  experience: number;
  level: number;
  streakDays: number;
  lastStreakDate: string | null;
  userName: string;
  dailyQuote: Quote | null;
  dailyChallenge: string | null;
  recentMessages: ChatMessage[];
  goals: {
    completed: number;
    total: number;
  };
  habits: {
    completed: number;
    total: number;
  };
  tasks: {
    completed: number;
    total: number;
  };
  setCoinsEarned: (coins: number) => void;
  addCoins: (amount: number) => void;
  addExperience: (amount: number) => void;
  checkAndUpdateStreak: () => void;
  setUserName: (name: string) => void;
  refreshDailyContent: () => void;
  incrementGoalCompleted: () => void;
  incrementGoalTotal: () => void;
  incrementHabitCompleted: () => void;
  incrementHabitTotal: () => void;
  incrementTaskCompleted: () => void;
  incrementTaskTotal: () => void;
  decrementTaskTotal: () => void;
  addMessage: (content: string) => void;
  clearMessages: () => void;
}

const EXPERIENCE_PER_LEVEL = 100;
const MAX_RECENT_MESSAGES = 20;

const useRiyaStore = create<RiyaState>()(
  persist(
    (set) => ({
      coinsEarned: 500,
      experience: 0,
      level: 1,
      streakDays: 0,
      lastStreakDate: null,
      userName: 'User',
      dailyQuote: null,
      dailyChallenge: null,
      recentMessages: [],
      goals: {
        completed: 0,
        total: 0,
      },
      habits: {
        completed: 0,
        total: 0,
      },
      tasks: {
        completed: 0,
        total: 0,
      },
      
      setCoinsEarned: (coins) => set({ coinsEarned: coins }),
      
      addCoins: (amount) => {
        set((state) => ({ coinsEarned: state.coinsEarned + amount }));
      },
      
      addExperience: (amount) => {
        set((state) => {
          const newExperience = state.experience + amount;
          const levelUps = Math.floor(newExperience / EXPERIENCE_PER_LEVEL);
          const remainingExperience = newExperience % EXPERIENCE_PER_LEVEL;
          
          return {
            experience: remainingExperience,
            level: state.level + levelUps,
          };
        });
      },
      
      // Add the new message to the chat history
      addMessage: (content) => {
        set((state) => {
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            content,
            timestamp: new Date()
          };
          
          // Keep only the most recent messages, up to MAX_RECENT_MESSAGES
          const updatedMessages = [
            newMessage,
            ...state.recentMessages
          ].slice(0, MAX_RECENT_MESSAGES);
          
          return { recentMessages: updatedMessages };
        });
      },
      
      // Clear all messages
      clearMessages: () => {
        set({ recentMessages: [] });
      },
      
      checkAndUpdateStreak: () => {
        set((state) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const lastDate = state.lastStreakDate ? new Date(state.lastStreakDate) : null;
          
          if (!lastDate) {
            // First time logging in
            return { 
              streakDays: 1, 
              lastStreakDate: today.toISOString() 
            };
          }
          
          lastDate.setHours(0, 0, 0, 0);
          
          const diffTime = Math.abs(today.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Consecutive day
            return { 
              streakDays: state.streakDays + 1, 
              lastStreakDate: today.toISOString() 
            };
          } else if (diffDays === 0) {
            // Same day, no change
            return state;
          } else {
            // Streak broken
            return { 
              streakDays: 1, 
              lastStreakDate: today.toISOString() 
            };
          }
        });
      },
      
      refreshDailyContent: () => {
        const today = new Date();
        const dayOfMonth = today.getDate();
        
        // Get quote and challenge based on day of month
        const quoteIndex = dayOfMonth % quotes.length;
        const challengeIndex = dayOfMonth % challenges.length;
        
        set({
          dailyQuote: quotes[quoteIndex],
          dailyChallenge: challenges[challengeIndex]
        });
      },
      
      setUserName: (name) => {
        set({ userName: name });
        localStorage.setItem('userName', name);
      },
      
      incrementGoalCompleted: () => {
        set((state) => ({
          goals: {
            ...state.goals,
            completed: state.goals.completed + 1,
          },
        }));
      },
      
      incrementGoalTotal: () => {
        set((state) => ({
          goals: {
            ...state.goals,
            total: state.goals.total + 1,
          },
        }));
      },
      
      incrementHabitCompleted: () => {
        set((state) => ({
          habits: {
            ...state.habits,
            completed: state.habits.completed + 1,
          },
        }));
      },
      
      incrementHabitTotal: () => {
        set((state) => ({
          habits: {
            ...state.habits,
            total: state.habits.total + 1,
          },
        }));
      },
      
      incrementTaskCompleted: () => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            completed: state.tasks.completed + 1,
          },
        }));
      },
      
      incrementTaskTotal: () => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            total: state.tasks.total + 1,
          },
        }));
      },
      
      decrementTaskTotal: () => {
        set((state) => ({
          tasks: {
            ...state.tasks,
            total: Math.max(0, state.tasks.total - 1),
          },
        }));
      },
    }),
    {
      name: 'riya-storage',
      partialize: (state) => ({
        coinsEarned: state.coinsEarned,
        experience: state.experience,
        level: state.level,
        streakDays: state.streakDays,
        lastStreakDate: state.lastStreakDate,
        userName: state.userName,
        dailyQuote: state.dailyQuote,
        dailyChallenge: state.dailyChallenge,
        recentMessages: state.recentMessages,
        goals: state.goals,
        habits: state.habits,
        tasks: state.tasks,
      }),
    }
  )
);

export const useRiya = () => {
  const state = useRiyaStore();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check and update streak each time the component is mounted
    state.checkAndUpdateStreak();
    
    // Refresh daily content if not already set
    if (!state.dailyQuote || !state.dailyChallenge) {
      state.refreshDailyContent();
    }
  }, [state]);
  
  // Wrapper for adding coins with toast notification
  const addCoinsWithToast = (amount: number) => {
    state.addCoins(amount);
    
    toast({
      title: `+${amount} coins earned!`,
      description: "Keep up the good work!",
      duration: 2000,
    });
    
    // Play coin sound
    playSound('coin');
  };
  
  // Wrapper for adding experience with level up notification
  const addExperienceWithLevelUp = (amount: number) => {
    const prevLevel = state.level;
    state.addExperience(amount);
    
    // Check if leveled up
    if (state.level > prevLevel) {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${state.level}!`,
        duration: 3000,
      });
      
      // Play level up sound
      playSound('levelup');
    }
  };
  
  return {
    ...state,
    addCoins: addCoinsWithToast,
    addExperience: addExperienceWithLevelUp,
  };
};

export type RiyaContextType = ReturnType<typeof useRiya>; 