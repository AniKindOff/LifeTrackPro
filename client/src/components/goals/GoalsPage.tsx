import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2
} from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';

type Goal = {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'work' | 'health' | 'learning' | 'financial';
  deadline: string;
  progress: number;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
};

export function GoalsPage() {
  const { addReward } = useRiya();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Run a Half Marathon',
      description: 'Train and complete a half marathon in under 2 hours.',
      category: 'health',
      deadline: '2023-12-15',
      progress: 65,
      tasks: [
        { id: 't1', title: 'Complete couch to 5K program', completed: true },
        { id: 't2', title: 'Run 10K distance three times', completed: true },
        { id: 't3', title: 'Sign up for half marathon event', completed: true },
        { id: 't4', title: 'Complete 15K training run', completed: false },
        { id: 't5', title: 'Finish half marathon', completed: false }
      ],
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Learn React Native',
      description: 'Build a mobile app using React Native and publish to app stores.',
      category: 'learning',
      deadline: '2023-11-30',
      progress: 40,
      tasks: [
        { id: 't1', title: 'Complete React Native course', completed: true },
        { id: 't2', title: 'Build to-do app prototype', completed: true },
        { id: 't3', title: 'Implement authentication', completed: false },
        { id: 't4', title: 'Add offline support', completed: false },
        { id: 't5', title: 'Publish to app stores', completed: false }
      ],
      priority: 'medium',
      completed: false
    }
  ]);
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'progress' | 'tasks' | 'completed'>>({
    title: '',
    description: '',
    category: 'personal',
    deadline: '',
    priority: 'medium',
  });
  
  // Add a new goal
  const handleAddGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      tasks: [],
      completed: false
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      deadline: '',
      priority: 'medium',
    });
    setIsAddingGoal(false);
    
    // Add coins for creating a new goal
    addReward(50, 'Created a new goal');
  };
  
  // Toggle task completion
  const toggleTask = (goalId: string, taskId: string) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id !== goalId) return goal;
        
        const updatedTasks = goal.tasks.map(task => 
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedTasksCount / updatedTasks.length) * 100);
        
        // Check if all tasks are completed
        const allCompleted = updatedTasks.every(t => t.completed);
        
        if (allCompleted && !goal.completed) {
          // Add extra coins for completing a goal
          addReward(100, `Completed goal: ${goal.title}`);
        }
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress,
          completed: allCompleted
        };
      })
    );
  };
  
  // Add a task to a goal
  const addTask = (goalId: string, taskTitle: string) => {
    if (!taskTitle.trim()) return;
    
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        if (goal.id !== goalId) return goal;
        
        const newTask = {
          id: Date.now().toString(),
          title: taskTitle,
          completed: false
        };
        
        const updatedTasks = [...goal.tasks, newTask];
        const completedTasksCount = updatedTasks.filter(t => t.completed).length;
        const progress = updatedTasks.length ? Math.round((completedTasksCount / updatedTasks.length) * 100) : 0;
        
        return {
          ...goal,
          tasks: updatedTasks,
          progress
        };
      })
    );
  };
  
  // Delete a goal
  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };
  
  // Get color for category
  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800 border-blue-200',
      work: 'bg-purple-100 text-purple-800 border-purple-200',
      health: 'bg-green-100 text-green-800 border-green-200',
      learning: 'bg-amber-100 text-amber-800 border-amber-200',
      financial: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[category];
  };
  
  // Get color for priority
  const getPriorityColor = (priority: Goal['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 border-gray-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Goals</h1>
        <Button onClick={() => setIsAddingGoal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Goals</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {goals.filter(goal => !goal.completed).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">You don't have any active goals yet. Add one to get started!</p>
                <Button className="mt-4" onClick={() => setIsAddingGoal(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Your First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.filter(goal => !goal.completed).map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onToggleTask={toggleTask}
                  onAddTask={addTask}
                  onDelete={deleteGoal}
                  getCategoryColor={getCategoryColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          {goals.filter(goal => goal.completed).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">You haven't completed any goals yet. Keep working on your active goals!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.filter(goal => goal.completed).map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onToggleTask={toggleTask}
                  onAddTask={addTask}
                  onDelete={deleteGoal}
                  getCategoryColor={getCategoryColor}
                  getPriorityColor={getPriorityColor}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(['personal', 'work', 'health', 'learning', 'financial'] as Goal['category'][]).map(category => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category}</CardTitle>
                  <CardDescription>
                    {goals.filter(g => g.category === category).length} goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {goals.filter(g => g.category === category).map(goal => (
                      <li key={goal.id} className="flex items-center justify-between">
                        <span className={`flex-1 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {goal.title}
                        </span>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsAddingGoal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add {category} goal
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Goal Dialog */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Create a new goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="Enter goal title"
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What do you want to achieve?"
                value={newGoal.description}
                onChange={e => setNewGoal({...newGoal, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={value => setNewGoal({...newGoal, category: value as Goal['category']})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newGoal.priority}
                  onValueChange={value => setNewGoal({...newGoal, priority: value as Goal['priority']})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingGoal(false)}>Cancel</Button>
            <Button 
              onClick={handleAddGoal}
              disabled={!newGoal.title.trim() || !newGoal.deadline}
            >
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Goal Card Component
function GoalCard({ 
  goal, 
  onToggleTask, 
  onAddTask, 
  onDelete,
  getCategoryColor,
  getPriorityColor
}: {
  goal: Goal;
  onToggleTask: (goalId: string, taskId: string) => void;
  onAddTask: (goalId: string, taskTitle: string) => void;
  onDelete: (goalId: string) => void;
  getCategoryColor: (category: Goal['category']) => string;
  getPriorityColor: (priority: Goal['priority']) => string;
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const handleAddTask = () => {
    onAddTask(goal.id, newTaskTitle);
    setNewTaskTitle('');
  };
  
  const daysUntilDeadline = () => {
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const days = daysUntilDeadline();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{goal.title}</CardTitle>
            <CardDescription>{goal.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Badge variant="outline" className={getCategoryColor(goal.category)}>
              {goal.category}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(goal.priority)}>
              {goal.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
              {days > 0 && !goal.completed && ` (${days} days left)`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>{goal.tasks.filter(t => t.completed).length}/{goal.tasks.length} tasks</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Tasks</h4>
          {goal.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet. Add some below.</p>
          ) : (
            <ul className="space-y-1">
              {goal.tasks.map(task => (
                <li key={task.id} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => onToggleTask(goal.id, task.id)}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
          
          {!goal.completed && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add new task"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        {goal.completed ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
} 