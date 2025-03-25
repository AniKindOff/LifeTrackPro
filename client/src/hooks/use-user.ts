import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  tasks: {
    completed: number;
    total: number;
  };
  achievements: {
    unlocked: number;
    total: number;
  };
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  updateCoins: (amount: number) => void;
  updateXP: (amount: number) => void;
  updateLevel: (level: number) => void;
  updateStreak: (streak: number) => void;
}

// Create a mock user for development
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  level: 3,
  xp: 1250,
  coins: 450,
  streak: 7,
  tasks: {
    completed: 25,
    total: 50,
  },
  achievements: {
    unlocked: 8,
    total: 20,
  },
};

export const useUser = create<UserStore>((set) => ({
  user: mockUser, // For development, we're using a mock user
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  updateCoins: (amount) => set((state) => ({
    user: state.user ? {
      ...state.user,
      coins: state.user.coins + amount,
    } : null,
  })),
  updateXP: (amount) => set((state) => ({
    user: state.user ? {
      ...state.user,
      xp: state.user.xp + amount,
    } : null,
  })),
  updateLevel: (level) => set((state) => ({
    user: state.user ? {
      ...state.user,
      level,
    } : null,
  })),
  updateStreak: (streak) => set((state) => ({
    user: state.user ? {
      ...state.user,
      streak,
    } : null,
  })),
})); 