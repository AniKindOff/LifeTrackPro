import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductivityState {
  productivityScore: number;
  focusTime: number;
  tasksCompleted: number;
  totalTasks: number;
  updateProductivityScore: (score: number) => void;
  updateFocusTime: (time: number) => void;
  incrementTasksCompleted: () => void;
  incrementTotalTasks: () => void;
  resetDaily: () => void;
}

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set) => ({
      productivityScore: 0,
      focusTime: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      updateProductivityScore: (score) => set({ productivityScore: score }),
      updateFocusTime: (time) => set({ focusTime: time }),
      incrementTasksCompleted: () =>
        set((state) => ({ tasksCompleted: state.tasksCompleted + 1 })),
      incrementTotalTasks: () =>
        set((state) => ({ totalTasks: state.totalTasks + 1 })),
      resetDaily: () =>
        set({
          productivityScore: 0,
          focusTime: 0,
          tasksCompleted: 0,
          totalTasks: 0,
        }),
    }),
    {
      name: 'productivity-storage',
    }
  )
); 