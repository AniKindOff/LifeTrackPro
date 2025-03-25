import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  streak: number;
  target: number;
  current: number;
  daysCompleted: string[];
  category: 'health' | 'productivity' | 'personal' | 'other';
  color: string;
  lastUpdated: string;
}

export function MultiTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Daily meditation',
      streak: 4,
      target: 10,
      current: 5,
      daysCompleted: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05'],
      category: 'health',
      color: 'bg-blue-500',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Read for 30 minutes',
      streak: 2,
      target: 30,
      current: 10,
      daysCompleted: ['2023-05-04', '2023-05-05'],
      category: 'personal',
      color: 'bg-purple-500',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Drink 8 glasses of water',
      streak: 0,
      target: 8,
      current: 3,
      daysCompleted: [],
      category: 'health',
      color: 'bg-cyan-500',
      lastUpdated: new Date().toISOString(),
    }
  ]);
  
  const [newHabit, setNewHabit] = useState('');
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryColors = {
    health: 'bg-green-100 text-green-800',
    productivity: 'bg-blue-100 text-blue-800',
    personal: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const addHabit = () => {
    if (newHabit.trim() === '') return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      streak: 0,
      target: 1,
      current: 0,
      daysCompleted: [],
      category: selectedCategory as Habit['category'],
      color: getRandomColor(),
      lastUpdated: new Date().toISOString(),
    };
    
    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-cyan-500',
      'bg-amber-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const incrementHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().toISOString().split('T')[0];
          const isToday = habit.lastUpdated.includes(today);
          const alreadyCompletedToday = habit.daysCompleted.includes(today);
          
          let newCurrent = habit.current;
          let newStreak = habit.streak;
          let newDaysCompleted = [...habit.daysCompleted];
          
          // Only increment if not already at target
          if (habit.current < habit.target) {
            newCurrent = habit.current + 1;
          }
          
          // Add today to completed days if we reached the target and haven't already added it
          if (newCurrent >= habit.target && !alreadyCompletedToday) {
            newDaysCompleted.push(today);
            
            // Increment streak if first time completing today
            if (!isToday) {
              newStreak = habit.streak + 1;
            }
          }
          
          return {
            ...habit,
            current: newCurrent,
            streak: newStreak,
            daysCompleted: newDaysCompleted,
            lastUpdated: new Date().toISOString(),
          };
        }
        return habit;
      })
    );
  };

  const decrementHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id && habit.current > 0) {
          const today = new Date().toISOString().split('T')[0];
          let newDaysCompleted = [...habit.daysCompleted];
          let newStreak = habit.streak;
          
          // Remove today from completed days if we're dropping below target
          if (habit.current === habit.target && habit.daysCompleted.includes(today)) {
            newDaysCompleted = newDaysCompleted.filter(day => day !== today);
            
            // Decrement streak if it was incremented today
            if (habit.lastUpdated.includes(today)) {
              newStreak = Math.max(0, habit.streak - 1);
            }
          }
          
          return {
            ...habit,
            current: habit.current - 1,
            streak: newStreak,
            daysCompleted: newDaysCompleted,
            lastUpdated: new Date().toISOString(),
          };
        }
        return habit;
      })
    );
  };

  const resetHabit = (id: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            current: 0,
            lastUpdated: new Date().toISOString(),
          };
        }
        return habit;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const isHabitCompleted = (habit: Habit) => {
    return habit.current >= habit.target;
  };

  // Calculate completion percentages
  const completionPercentages = habits.map(habit => ({
    id: habit.id,
    percentage: Math.round((habit.current / habit.target) * 100)
  }));

  // Filter habits based on completion and category
  const filteredHabits = habits.filter(habit => {
    const isCompleted = habit.current >= habit.target;
    const categoryMatch = selectedCategory ? habit.category === selectedCategory : true;
    return (showCompleted || !isCompleted) && categoryMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Habit Tracker</h2>
          <p className="text-muted-foreground">Track your daily habits and build consistency</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label htmlFor="show-completed">Show completed</Label>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {selectedCategory ? selectedCategory : 'All Categories'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('health')}>
                Health
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('productivity')}>
                Productivity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('personal')}>
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory('other')}>
                Other
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Add new habit card */}
        <Card gradient={true} className="flex h-[220px] flex-col justify-center items-center p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="text-center space-y-4">
            <div className="mx-auto rounded-full bg-primary/10 p-3 text-primary">
              <Plus className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Add New Habit</h3>
              <p className="text-sm text-muted-foreground">Track a new daily or weekly habit</p>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newHabit.trim()) {
                  addHabit();
                }
              }}
              className="flex gap-2"
            >
              <Input
                type="text"
                placeholder="New habit name"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                className="flex-1"
              />
              <Button variant="gradient" type="submit" disabled={!newHabit.trim()}>
                Add
              </Button>
            </form>
          </div>
        </Card>

        {/* Existing habits */}
        <AnimatePresence>
          {filteredHabits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card gradient={true} className="h-[220px] overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge variant="gradient">{habit.category}</Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-gray-700"
                        onClick={() => setEditingHabit(habit)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-500 hover:text-red-500"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-1">{habit.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {habit.current}/{habit.target}
                        {habit.current >= habit.target && (
                          <span className="text-green-500 ml-1">
                            <Check className="inline h-4 w-4" />
                          </span>
                        )}
                      </span>
                    </div>
                    <Progress value={Math.min(100, (habit.current / habit.target) * 100)} />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{habit.streak}</span> day streak
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => decrementHabit(habit.id)}
                        disabled={habit.current === 0}
                      >
                        <span className="sr-only">Decrease</span>
                        <span className="text-lg">-</span>
                      </Button>
                      
                      <span className="w-16 text-center">
                        {habit.current} / {habit.target}
                      </span>
                      
                      <Button
                        variant="gradient"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => incrementHabit(habit.id)}
                        disabled={habit.current >= habit.target}
                      >
                        <span className="sr-only">Increase</span>
                        <span className="text-lg">+</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 