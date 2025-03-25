import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GamificationState {
  xp: number;
  level: number;
  coins: number;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  useCoins: (amount: number) => boolean;
}

const calculateLevel = (xp: number): number => {
  // Level formula: Each level requires base_xp * (level ^ 1.5)
  // Level 1: 100 XP
  // Level 2: 283 XP
  // Level 3: 520 XP
  // etc.
  const base_xp = 100;
  let level = 1;
  while (xp >= base_xp * (Math.pow(level, 1.5))) {
    level++;
  }
  return level - 1;
};

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      coins: 0,
      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = calculateLevel(newXP);
          return {
            xp: newXP,
            level: newLevel,
          };
        });
      },
      addCoins: (amount: number) => {
        set((state) => ({
          coins: state.coins + amount,
        }));
      },
      useCoins: (amount: number) => {
        const state = get();
        if (state.coins >= amount) {
          set({ coins: state.coins - amount });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'gamification-storage',
    }
  )
); 