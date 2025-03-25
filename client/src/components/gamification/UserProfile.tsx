import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRiya } from '@/hooks/use-riya';
import { ShopDialog } from './ShopDialog';
import {
  Trophy,
  Award,
  Flame,
  Target,
  Coins,
  TrendingUp,
  ArrowUp,
  Sparkles,
  BadgeCheck
} from 'lucide-react';

export function UserProfile() {
  const { currentLevel, coinsEarned, financeTip, habitAdvice, dailyChallenge } = useRiya();
  const [shopOpen, setShopOpen] = useState(false);
  
  // Calculate progress to next level
  const progressToNextLevel = 75; // Mock progress percentage
  
  // Mock statistics
  const stats = {
    streakDays: 7,
    tasksCompleted: 42,
    habitsFormed: 5,
    savingsGoalsReached: 3,
    achievements: [
      {
        id: '1',
        name: 'Early Bird',
        description: 'Completed 5 tasks before 10 AM',
        category: 'Productivity',
        completed: true,
        reward: { coins: 50 },
        icon: Award
      },
      {
        id: '2',
        name: 'Financial Wizard',
        description: 'Saved 10% of income for 3 months',
        category: 'Finance',
        completed: true,
        reward: { coins: 100 },
        icon: Coins
      },
      {
        id: '3',
        name: 'Consistency King',
        description: 'Maintained a 7-day streak',
        category: 'Habits',
        completed: true,
        reward: { coins: 75 },
        icon: Flame
      },
      {
        id: '4',
        name: 'Learning Champion',
        description: 'Spent 20 hours on educational content',
        category: 'Learning',
        completed: true,
        reward: { coins: 80 },
        icon: TrendingUp
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div 
        className="space-y-6 py-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-1 border shadow-sm">
              <Badge variant="secondary" className="px-1.5 py-0.5">
                Lvl {currentLevel}
              </Badge>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">Financial Wizard</h2>
            <p className="text-sm text-muted-foreground">Premium Member</p>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div variants={itemVariants}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-primary" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Level {currentLevel}</span>
                  <span>{progressToNextLevel}% to Level {currentLevel + 1}</span>
                </div>
                <motion.div
                  className="h-2 rounded-full bg-primary/20 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressToNextLevel}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                    <p className="font-semibold">{currentLevel * 100}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Coins</p>
                    <p className="font-semibold">{coinsEarned}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={() => setShopOpen(true)}
                >
                  <Coins className="h-4 w-4" />
                  Visit Shop
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 card-hover">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Flame className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-semibold">{stats.streakDays} Days</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 card-hover">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="font-semibold">{stats.tasksCompleted}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 card-hover">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Habits</p>
                  <p className="font-semibold">{stats.habitsFormed}</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 card-hover">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Goals</p>
                  <p className="font-semibold">{stats.savingsGoalsReached}</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div variants={itemVariants}>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {stats.achievements.slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                whileHover={{ x: 3 }}
                className="bg-card rounded-lg border p-3 flex items-start gap-3 card-hover"
              >
                <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                  <achievement.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span>{achievement.reward.coins}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {achievement.description}
                  </p>
                  <Badge variant="secondary" className="mt-1.5 text-[10px] py-0 px-1.5">
                    {achievement.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs hover:bg-primary/5 text-primary"
            >
              View All Achievements
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      <ShopDialog isOpen={shopOpen} onClose={() => setShopOpen(false)} />
    </>
  );
} 