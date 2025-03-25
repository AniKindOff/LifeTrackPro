import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Award,
  Book,
  Plus,
  BarChart3,
  Layers,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRiya } from '@/hooks/use-riya';
import { RiyaChat } from '@/components/chat/RiyaChat';
import { ShopDialog } from '@/components/gamification/ShopDialog';

// Mock data for the dashboard
const MOCK_TASKS = [
  { id: '1', title: 'Complete project proposal', completed: false, dueDate: '2023-12-01', priority: 'high' },
  { id: '2', title: 'Schedule team meeting', completed: true, dueDate: '2023-11-28', priority: 'medium' },
  { id: '3', title: 'Review documentation', completed: false, dueDate: '2023-12-05', priority: 'low' },
];

const MOCK_HABITS = [
  { id: '1', title: 'Daily meditation', streak: 7, icon: '🧘' },
  { id: '2', title: 'Read for 30 minutes', streak: 12, icon: '📚' },
  { id: '3', title: 'Exercise', streak: 5, icon: '🏃' },
];

const MOCK_GOALS = [
  { id: '1', title: 'Learn React', progress: 75, category: 'Learning' },
  { id: '2', title: 'Finish side project', progress: 40, category: 'Projects' },
  { id: '3', title: 'Read 12 books this year', progress: 83, category: 'Personal' },
];

const MOCK_FOCUS_SESSIONS = [
  { id: '1', duration: 25, label: 'Project work', date: '2023-11-28' },
  { id: '2', duration: 50, label: 'Deep work', date: '2023-11-27' },
  { id: '3', duration: 25, label: 'Study session', date: '2023-11-26' },
];

// Mock data for charts
const WEEKLY_TASKS = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  completed: [3, 5, 2, 4, 3, 1, 0],
  total: [5, 8, 3, 7, 4, 3, 2],
};

const WEEKLY_FOCUS = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [35, 75, 50, 90, 65, 40, 30],
};

export const DashboardPage = () => {
  const { userName, coinsEarned, level, experience, streakDays, checkAndUpdateStreak } = useRiya();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isRiyaChatOpen, setIsRiyaChatOpen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [quote, setQuote] = useState({
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  });
  
  // Check streak on page load
  useEffect(() => {
    checkAndUpdateStreak();
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
    
    // Rotate through motivational quotes (simplified for example)
    const quotes = [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
      { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    ];
    
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [checkAndUpdateStreak]);

  // Calculate today's task completion percentage
  const tasksToday = MOCK_TASKS.length;
  const tasksCompletedToday = MOCK_TASKS.filter(task => task.completed).length;
  const taskCompletionPercentage = tasksToday > 0 
    ? Math.round((tasksCompletedToday / tasksToday) * 100) 
    : 0;
  
  // Progress to next level (0-100%)
  const progressToNextLevel = (experience / 100) * 100;
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Good {timeOfDay}, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your productivity and progress.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 border-amber-200 dark:border-amber-800"
            onClick={() => setIsShopOpen(true)}
          >
            <Award className="h-4 w-4 text-amber-500 mr-2" />
            <span className="font-medium text-amber-600 dark:text-amber-400">{coinsEarned} Coins</span>
          </Button>
          
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => setIsRiyaChatOpen(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask Riya
          </Button>
        </div>
      </div>
      
      {/* Quote Card */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-8 quote-card">
        <p className="text-lg italic">"{quote.text}"</p>
        <p className="text-sm text-right mt-2 text-muted-foreground">— {quote.author}</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card bg-card rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Tasks Today</h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="mt-2 mb-1 flex items-end">
            <span className="text-2xl font-bold">{tasksCompletedToday}/{tasksToday}</span>
            <span className="text-xs ml-2 mb-1 text-muted-foreground">tasks</span>
          </div>
          <Progress value={taskCompletionPercentage} className="h-1.5" />
        </div>
        
        <div className="stat-card bg-card rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 flex items-end">
            <span className="text-2xl font-bold">{streakDays}</span>
            <span className="text-xs ml-2 mb-1 text-muted-foreground">days</span>
          </div>
          <div className="flex mt-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 mr-0.5 rounded-full ${
                  i < (streakDays % 7) ? 'bg-amber-500' : 'bg-amber-200 dark:bg-amber-800/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="stat-card bg-card rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Focus Time</h3>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-2 flex items-end">
            <span className="text-2xl font-bold">
              {WEEKLY_FOCUS.values.reduce((a, b) => a + b, 0)}
            </span>
            <span className="text-xs ml-2 mb-1 text-muted-foreground">minutes this week</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1.5">
            <span>+15% from last week</span>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
        </div>
        
        <div className="stat-card bg-card rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Level Progress</h3>
            <Award className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="mt-2 mb-1 flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold">{level}</span>
              <span className="text-xs ml-1 mb-1 text-muted-foreground">level</span>
            </div>
            <span className="text-sm font-medium">{experience}/100 XP</span>
          </div>
          <Progress value={progressToNextLevel} className="h-1.5" />
        </div>
      </div>
      
      {/* Tasks & Habits Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="divide-y">
            {MOCK_TASKS.length > 0 ? (
              MOCK_TASKS.map(task => (
                <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors task-item">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className={`font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        
                        {task.dueDate && (
                          <Badge variant="outline" className="ml-2 whitespace-nowrap">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No tasks found. Create your first task!</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-muted/50 border-t">
            <Link to="/tasks">
              <Button variant="link" size="sm" className="w-full">View all tasks</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Habit Streaks</h2>
              <Link to="/habits">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Habit</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="divide-y">
            {MOCK_HABITS.length > 0 ? (
              MOCK_HABITS.map(habit => (
                <div key={habit.id} className="p-4 hover:bg-muted/50 transition-colors habit-item">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{habit.icon}</div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{habit.title}</p>
                      
                      <div className="mt-1 flex items-center">
                        <div className="flex-1 flex gap-0.5">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-1.5 flex-1 rounded-full ${
                                i < Math.min(habit.streak, 7) ? 'bg-red-500' : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <Badge variant="secondary" className="ml-2 gap-1 flex items-center">
                          <Zap className="h-3 w-3" />
                          {habit.streak} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No habits found. Start building habits!</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-muted/50 border-t">
            <Link to="/habits">
              <Button variant="link" size="sm" className="w-full">Manage habits</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Goals & Focus Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Goals Progress</h2>
              <Link to="/goals">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Goal</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="divide-y">
            {MOCK_GOALS.length > 0 ? (
              MOCK_GOALS.map(goal => (
                <div key={goal.id} className="p-4 hover:bg-muted/50 transition-colors goal-item">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-medium">{goal.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-1 mr-3">
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">{goal.progress}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No goals found. Set your first goal!</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-muted/50 border-t">
            <Link to="/goals">
              <Button variant="link" size="sm" className="w-full">View all goals</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Focus Sessions</h2>
              <Link to="/focus">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Start Session</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="divide-y">
            {MOCK_FOCUS_SESSIONS.length > 0 ? (
              MOCK_FOCUS_SESSIONS.map(session => (
                <div key={session.id} className="p-4 hover:bg-muted/50 transition-colors focus-item">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{session.label}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <Badge>{session.duration} min</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No focus sessions found. Start focusing!</p>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-muted/50 border-t">
            <Link to="/focus">
              <Button variant="link" size="sm" className="w-full">View focus history</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/analytics" className="quick-access-card group bg-card rounded-lg border shadow-sm p-4 hover:shadow-md hover:border-primary/50 transition-all">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-10 w-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="font-medium">Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">View detailed reports and insights</p>
        </Link>
        
        <Link to="/journal" className="quick-access-card group bg-card rounded-lg border shadow-sm p-4 hover:shadow-md hover:border-primary/50 transition-all">
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 h-10 w-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Book className="h-5 w-5" />
          </div>
          <h3 className="font-medium">Journal</h3>
          <p className="text-sm text-muted-foreground mt-1">Record your thoughts and reflections</p>
        </Link>
        
        <div className="quick-access-card group bg-card rounded-lg border shadow-sm p-4 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer" onClick={() => setIsRiyaChatOpen(true)}>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 h-10 w-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="font-medium">Ask Riya</h3>
          <p className="text-sm text-muted-foreground mt-1">Get help and guidance from your assistant</p>
        </div>
        
        <div className="quick-access-card group bg-card rounded-lg border shadow-sm p-4 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer" onClick={() => setIsShopOpen(true)}>
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 h-10 w-10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-medium">Rewards Shop</h3>
          <p className="text-sm text-muted-foreground mt-1">Spend your earned coins on rewards</p>
        </div>
      </div>
      
      {/* Mobile quick access button for Riya */}
      <div className="fixed bottom-6 right-6 sm:hidden z-20">
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsRiyaChatOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Dialogs */}
      <ShopDialog isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      {isRiyaChatOpen && <RiyaChat onClose={() => setIsRiyaChatOpen(false)} />}
    </div>
  );
}; 