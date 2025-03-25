import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  milestones: Milestone[];
  deadline: Date;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, milestone: Milestone) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
      toggleMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: goal.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? { ...milestone, completed: !milestone.completed }
                      : milestone
                  ),
                  progress:
                    (goal.milestones.filter((m) => m.completed).length /
                      goal.milestones.length) *
                    100,
                }
              : goal
          ),
        })),
      addMilestone: (goalId, milestone) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: [...goal.milestones, milestone],
                }
              : goal
          ),
        })),
      deleteMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: goal.milestones.filter(
                    (m) => m.id !== milestoneId
                  ),
                }
              : goal
          ),
        })),
    }),
    {
      name: 'goal-storage',
    }
  )
); 