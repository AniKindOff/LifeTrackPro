import React, { useState } from 'react';
import { CheckCircle, Clock, Circle, Edit, Trash, Tag, AlertCircle } from 'lucide-react';
import { Task } from '@/types';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRiya } from '@/hooks/use-riya';
import { useToast } from '@/components/ui/use-toast';
import { playSound } from '@/lib/sound-manager';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const { addCoins } = useRiya();
  const { toast } = useToast();
  
  const handleStatusChange = () => {
    if (!task.completed) {
      setIsCompleting(true);
      
      // Play completion sound using the sound manager
      playSound('success');
      
      // Add coins for completing task
      const coinAmount = getPriorityValue() * 10;
      addCoins(coinAmount);
      
      // Show toast
      toast({
        title: "Task Completed! 🎉",
        description: `You earned ${coinAmount} coins for completing this task.`,
        variant: "default"
      });
      
      // Delay to show animation
      setTimeout(() => {
        onStatusChange(task.id, !task.completed);
        setIsCompleting(false);
      }, 600);
    } else {
      onStatusChange(task.id, !task.completed);
    }
  };
  
  const getPriorityValue = () => {
    switch (task.priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };
  
  const priorityColorClass = {
    high: "text-red-500 bg-red-50 dark:bg-red-950/20",
    medium: "text-orange-500 bg-orange-50 dark:bg-orange-950/20",
    low: "text-green-500 bg-green-50 dark:bg-green-950/20",
  };
  
  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const isPast = date < today;
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };
  
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < now;
  };
  
  return (
    <div 
      className={`task-card group relative rounded-lg border p-4 shadow-sm transition-all duration-300
        ${isCompleting ? 'scale-105 border-green-500 bg-green-50 dark:bg-green-950/20' : ''}
        ${task.completed ? 'opacity-80 bg-muted' : 'bg-card hover:shadow-md'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isCompleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 rounded-lg z-10">
          <div className="animate-ping text-green-500">
            <CheckCircle size={40} />
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <button 
          onClick={handleStatusChange}
          className={`mt-0.5 flex-shrink-0 transition-colors duration-300 ${
            task.completed ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground hover:text-primary'
          }`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className={`text-base font-medium line-clamp-2 sm:mr-8 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              {task.priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium whitespace-nowrap ${priorityColorClass[task.priority as keyof typeof priorityColorClass]}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
              )}
              
              {task.dueDate && (
                <Badge 
                  variant="outline"
                  className={`flex items-center gap-1 whitespace-nowrap ${isOverdue() ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}
                >
                  {isOverdue() ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {formatDueDate(task.dueDate)}
                </Badge>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <div key={index} className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  <Tag className="h-3 w-3" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={`absolute right-2 top-2 flex items-center gap-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={() => {
            playSound('delete');
            onDelete(task.id);
          }}
          aria-label="Delete task"
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}; 