import React, { useState } from 'react';
import GamificationService from '../services/gamificationService';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  streak: number;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const gamificationService = GamificationService.getInstance();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      frequency,
      completedDates: [],
      streak: 0,
    };

    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const handleToggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        const updatedDates = isCompleted
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];

        // Update streak
        let newStreak = habit.streak;
        if (!isCompleted) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (habit.completedDates.includes(yesterdayStr)) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
          
          // Award XP for completing a habit
          gamificationService.addXP(20);
        } else {
          newStreak = 0;
        }

        return {
          ...habit,
          completedDates: updatedDates,
          streak: newStreak,
        };
      }
      return habit;
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Habit Tracker</h2>
      
      <form onSubmit={handleAddHabit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {habits.map(habit => {
          const today = new Date().toISOString().split('T')[0];
          const isCompleted = habit.completedDates.includes(today);
          
          return (
            <div
              key={habit.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggleHabit(habit.id)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <div>
                  <h3 className="font-medium">{habit.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {habit.frequency} • Streak: {habit.streak} days
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteHabit(habit.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker; 