import { create } from 'zustand';

interface HealthState {
  waterIntake: number;
  currentMood: string;
  waterGoal: number;
  addWater: () => void;
  updateMood: (mood: string) => void;
  setWaterGoal: (goal: number) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  waterIntake: 0,
  currentMood: '😊 Happy',
  waterGoal: 2000,

  addWater: () => {
    set(({ waterIntake }) => ({
      waterIntake: waterIntake + 250,
    }));
  },

  updateMood: (mood: string) => {
    set({
      currentMood: mood,
    });
  },

  setWaterGoal: (goal: number) => {
    set({
      waterGoal: goal,
    });
  },
}));