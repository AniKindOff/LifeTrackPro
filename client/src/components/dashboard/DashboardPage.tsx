import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Award, Sparkles, CheckCircle2, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakCount, setStreakCount] = useState(5);
  const [showAnimation, setShowAnimation] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(65);

  // Mock data
  const tasks = [
    { id: 1, title: 'Complete project proposal', completed: true, dueDate: '2025-03-25' },
    { id: 2, title: 'Review quarterly reports', completed: false, dueDate: '2025-03-26' },
    { id: 3, title: 'Schedule team meeting', completed: true, dueDate: '2025-03-24' },
    { id: 4, title: 'Update portfolio website', completed: false, dueDate: '2025-03-27' },
  ];

  const habits = [
    { id: 1, name: 'Morning Meditation', streak: 8, target: 10, completed: true },
    { id: 2, name: 'Read 30 minutes', streak: 5, target: 7, completed: true },
    { id: 3, name: 'Exercise', streak: 3, target: 5, completed: false },
  ];

  const quote = {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Show animations after a delay
      setTimeout(() => {
        setShowAnimation(true);
      }, 300);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg font-medium text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Confetti effect would be rendered here */}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your progress.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card gradient={true}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakCount} days</div>
            <p className="text-xs text-muted-foreground">Keep going!</p>
          </CardContent>
        </Card>
        <Card gradient={true}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>
        <Card gradient={true}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        <Card gradient={true}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Points</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">Earn more to unlock rewards</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card gradient={true} className="col-span-full md:col-span-3">
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>
              You have completed {tasks.filter(t => t.completed).length} out of {tasks.length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="gradient" className="w-full" asChild>
              <Link to="/tasks">View All Tasks</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card gradient={true} className="col-span-full md:col-span-4">
          <CardHeader>
            <CardTitle>Habit Tracking</CardTitle>
            <CardDescription>Your daily habits and streak progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map(habit => (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{habit.name}</span>
                    <span className="text-xs font-medium">{habit.streak} day streak</span>
                  </div>
                  <Progress value={(habit.streak/habit.target) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="gradient" className="w-full" asChild>
              <Link to="/habits">Track Habits</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card gradient={true} className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Goals</CardTitle>
            <CardDescription>Focus areas for the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Complete Business Proposal</span>
              <span className="text-xs text-muted-foreground">75%</span>
            </div>
            <Progress value={75} />
            
            <div className="flex items-center justify-between pt-2">
              <span>Website Redesign</span>
              <span className="text-xs text-muted-foreground">40%</span>
            </div>
            <Progress value={40} />
            
            <div className="flex items-center justify-between pt-2">
              <span>Learn TypeScript</span>
              <span className="text-xs text-muted-foreground">60%</span>
            </div>
            <Progress value={60} />
          </CardContent>
          <CardFooter>
            <Button variant="gradient" size="sm" className="w-full" asChild>
              <Link to="/goals">Manage Goals</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card gradient={true} className="col-span-1">
          <CardHeader>
            <CardTitle>Financial Tracker</CardTitle>
            <CardDescription>This month's finance summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-xl font-medium">$4,280.00</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-xl font-medium">$2,430.00</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Savings</p>
              <p className="text-xl font-medium">$1,850.00</p>
              <Progress value={43} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">43% of monthly goal</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="gradient" size="sm" className="w-full" asChild>
              <Link to="/finance">View Finances</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card gradient={true} className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Inspiration</CardTitle>
            <CardDescription>Your motivational quote</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[140px] items-center justify-center p-6">
            <div className="text-center">
              <p className="font-medium italic">"{quote.text}"</p>
              <p className="mt-2 text-sm text-muted-foreground">— {quote.author}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="gradient" size="sm" className="w-full" asChild>
              <Link to="/inspiration">More Quotes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 