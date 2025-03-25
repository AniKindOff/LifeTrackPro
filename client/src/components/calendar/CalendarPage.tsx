import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BadgeCheck, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  PlusCircle,
  Calendar as CalendarIcon,
  MoreHorizontal,
  AlertCircle,
  Tag,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  completed: boolean;
  category: 'task' | 'habit' | 'meeting' | 'reminder';
  color: string;
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  
  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  
  // Get the day of the week for the first day (0-6, where 0 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get the number of days in the previous month
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  
  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      date: new Date(currentYear, currentMonth, 10),
      time: '10:00 AM',
      description: 'Finalize the project proposal and send it to the team for review.',
      completed: true,
      category: 'task',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      title: 'Team meeting',
      date: new Date(currentYear, currentMonth, 12),
      time: '2:00 PM',
      description: 'Weekly team sync-up meeting.',
      completed: false,
      category: 'meeting',
      color: 'bg-purple-500',
    },
    {
      id: '3',
      title: 'Daily meditation',
      date: new Date(currentYear, currentMonth, 15),
      completed: false,
      category: 'habit',
      color: 'bg-green-500',
    },
    {
      id: '4',
      title: 'Dentist appointment',
      date: new Date(currentYear, currentMonth, 18),
      time: '11:30 AM',
      description: 'Regular dental checkup.',
      completed: false,
      category: 'reminder',
      color: 'bg-amber-500',
    },
    {
      id: '5',
      title: 'Read for 30 minutes',
      date: new Date(currentYear, currentMonth, 20),
      completed: false,
      category: 'habit',
      color: 'bg-indigo-500',
    },
    {
      id: '6',
      title: 'Submit weekly report',
      date: new Date(currentYear, currentMonth, 22),
      time: '5:00 PM',
      description: 'Compile and submit the weekly progress report.',
      completed: false,
      category: 'task',
      color: 'bg-blue-500',
    },
    {
      id: '7',
      title: 'Coffee with Alex',
      date: new Date(currentYear, currentMonth, 15),
      time: '3:30 PM',
      description: 'Catch up over coffee at the local café.',
      completed: false,
      category: 'meeting',
      color: 'bg-purple-500',
    },
  ];
  
  // Function to generate the days for the calendar grid
  const generateCalendarDays = () => {
    const days = [];
    
    // Add days from the previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
      });
    }
    
    // Add days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        today: i === new Date().getDate() && 
               currentMonth === new Date().getMonth() && 
               currentYear === new Date().getFullYear(),
        date: new Date(currentYear, currentMonth, i),
      });
    }
    
    // Calculate how many days from the next month we need to add
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 rows x 7 days = 42
    
    // Add days from the next month
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(currentYear, currentMonth + 1, i),
      });
    }
    
    return days;
  };
  
  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      return event.date.getDate() === date.getDate() && 
             event.date.getMonth() === date.getMonth() && 
             event.date.getFullYear() === date.getFullYear();
    });
  };
  
  // Function to navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Function to navigate to the next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Function to navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const calendarDays = generateCalendarDays();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and track important events.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center rounded-md border">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-r-none"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-3 py-1 border-l border-r">
              <span className="font-medium">
                {monthNames[currentMonth]} {currentYear}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-l-none"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={currentView}
            onValueChange={(value) => setCurrentView(value as 'month' | 'week' | 'day')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Task</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Habit</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-xs text-muted-foreground">Meeting</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-muted-foreground">Reminder</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Day names */}
          <div className="grid grid-cols-7 text-center border-b">
            {dayNames.map((day, index) => (
              <div 
                key={day} 
                className={cn(
                  "py-2 text-sm font-medium text-muted-foreground",
                  (index === 0 || index === 6) && "text-muted-foreground/70"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 h-[600px] divide-x divide-y">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              
              return (
                <div 
                  key={index} 
                  className={cn(
                    "min-h-[100px] p-1 overflow-hidden transition-colors hover:bg-muted/50",
                    !day.currentMonth && "text-muted-foreground/50 bg-muted/30",
                    day.today && "bg-primary/5 font-bold"
                  )}
                >
                  <div className="flex justify-between items-start h-full flex-col">
                    <div className="w-full flex justify-between items-center p-1">
                      <span className={cn(
                        "h-6 w-6 flex items-center justify-center text-sm rounded-full",
                        day.today && "bg-primary text-primary-foreground"
                      )}>
                        {day.day}
                      </span>
                      {dayEvents.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Add Event
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              View All Events
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <div className="w-full space-y-1 overflow-y-auto scrollbar-hide">
                      {dayEvents.map((event, eventIndex) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: eventIndex * 0.05 }}
                          className={cn(
                            "text-xs p-1 rounded-sm truncate border-l-2",
                            event.color
                          )}
                          style={{ borderLeftColor: event.color.replace('bg-', '') }}
                        >
                          <div className="flex items-center gap-1">
                            {event.completed && (
                              <BadgeCheck className="h-3 w-3 text-green-500" />
                            )}
                            {event.time && (
                              <span className="text-xs text-muted-foreground">
                                {event.time}
                              </span>
                            )}
                          </div>
                          <span className={cn(
                            "font-medium",
                            event.completed && "line-through opacity-60"
                          )}>
                            {event.title}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {dayEvents.length > 2 && (
                      <Badge variant="outline" className="text-xs mt-1">
                        +{dayEvents.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.filter(event => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map(event => (
                  <div key={event.id} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                    <div className={cn("p-2 rounded-full mt-1", event.color.replace('bg-', 'bg-opacity-20'))}>
                      {event.category === 'task' && (
                        <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      )}
                      {event.category === 'habit' && (
                        <RepeatIcon className="h-4 w-4 text-green-500" />
                      )}
                      {event.category === 'meeting' && (
                        <UsersIcon className="h-4 w-4 text-purple-500" />
                      )}
                      {event.category === 'reminder' && (
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline" className={cn(
                          "capitalize",
                          event.category === 'task' && "bg-blue-50 text-blue-700 border-blue-200",
                          event.category === 'habit' && "bg-green-50 text-green-700 border-green-200",
                          event.category === 'meeting' && "bg-purple-50 text-purple-700 border-purple-200",
                          event.category === 'reminder' && "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {event.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        {event.time && (
                          <>
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habits Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.filter(event => event.category === 'habit')
                .map(habit => (
                  <div key={habit.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={cn("w-2 h-8 rounded-full", habit.color)}></div>
                        <span className="font-medium">{habit.title}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        habit.completed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {habit.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-8 rounded-sm border flex items-center justify-center",
                            i % 3 === 0 ? "bg-green-100 border-green-300" : "bg-muted"
                          )}
                        >
                          {i % 3 === 0 && <BadgeCheck className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icon components for rendering dynamic icons
function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function RepeatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
} 