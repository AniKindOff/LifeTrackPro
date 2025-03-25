import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Award, 
  Shield, 
  Zap, 
  Star, 
  Check, 
  Trophy,
  Save
} from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Achievement } from '@/types';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete 5 tasks before 10 AM',
    icon: '🌅',
    progress: 3,
    maxProgress: 5
  },
  {
    id: 'master-planner',
    title: 'Master Planner',
    description: 'Create 10 goals',
    icon: '📝',
    progress: 5,
    maxProgress: 10
  },
  {
    id: 'habit-hero',
    title: 'Habit Hero',
    description: 'Maintain a 7-day streak for any habit',
    icon: '🔥',
    unlockedAt: '2023-11-15T10:30:00Z'
  },
  {
    id: 'focus-master',
    title: 'Focus Master',
    description: 'Complete 10 focus sessions of 25+ minutes',
    icon: '⏱️',
    progress: 8,
    maxProgress: 10
  },
  {
    id: 'reflection-guru',
    title: 'Reflection Guru',
    description: 'Write 5 journal entries',
    icon: '📔',
    progress: 5,
    maxProgress: 5,
    unlockedAt: '2023-11-20T18:45:00Z'
  }
];

const BADGES = [
  { id: 'productivity-pro', name: 'Productivity Pro', icon: '⚡', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'goal-getter', name: 'Goal Getter', icon: '🎯', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'consistency-king', name: 'Consistency King', icon: '👑', color: 'bg-purple-100 text-purple-800 border-purple-200' }
];

export const ProfilePage = () => {
  const { toast } = useToast();
  const { 
    userName, 
    setUserName, 
    coinsEarned, 
    level, 
    experience, 
    streakDays, 
    checkAndUpdateStreak,
    goals,
    habits,
    tasks
  } = useRiya();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [badges, setBadges] = useState(BADGES);
  const [joinDate] = useState('2023-11-01T12:00:00Z');
  
  // Check streak on page load
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);
  
  const handleSaveName = () => {
    if (nameInput.trim() !== '') {
      setUserName(nameInput);
      setIsEditingName(false);
      
      toast({
        title: "Profile Updated",
        description: "Your name has been successfully updated.",
        variant: "default"
      });
      
      // Play sound
      const audio = new Audio('/sounds/success.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Failed to play sound'));
    }
  };
  
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const progressToNextLevel = experience / 100 * 100;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-background border-4 border-primary flex items-center justify-center text-4xl mb-4 float-animation">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-2 w-full max-w-xs">
                    <Input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-grow"
                      placeholder="Enter your name"
                      autoFocus
                    />
                    <Button size="icon" onClick={handleSaveName}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      aria-label="Edit name"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">user@example.com</span>
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined {formatJoinDate(joinDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900">
                  <Star className="h-5 w-5 text-yellow-500 mb-1" />
                  <span className="text-sm text-muted-foreground">Level</span>
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{level}</span>
                </div>
                
                <div className="flex flex-col items-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900">
                  <Zap className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">{streakDays} days</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Level Progress</span>
                  <span className="text-sm font-medium">{experience}/100 XP</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span>Coins Earned</span>
                  </div>
                  <span className="font-bold text-amber-600">{coinsEarned}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>Tasks Completed</span>
                  </div>
                  <span className="font-bold">{tasks.completed}/{tasks.total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span>Goals Achieved</span>
                  </div>
                  <span className="font-bold">{goals.completed}/{goals.total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    <span>Habits Formed</span>
                  </div>
                  <span className="font-bold">{habits.completed}/{habits.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`achievement-card p-4 rounded-lg border transition-all duration-300 ${
                      achievement.unlockedAt 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                        : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl achievement-icon">
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{achievement.title}</h4>
                          {achievement.unlockedAt && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        {achievement.maxProgress && !achievement.unlockedAt && (
                          <>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1.5"
                            />
                          </>
                        )}
                        
                        {achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Badges
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${badge.color} badge-card`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 