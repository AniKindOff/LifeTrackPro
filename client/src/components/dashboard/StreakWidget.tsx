import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Flame, Gift, Award, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Reward {
  id: string;
  name: string;
  description: string;
  requiredStreak: number;
  icon: JSX.Element;
}

const rewards: Reward[] = [
  { 
    id: 'daily-login',
    name: 'Daily Login',
    description: 'Log in every day to maintain your streak',
    requiredStreak: 1,
    icon: <Flame className="h-5 w-5 text-orange-500" />
  },
  {
    id: '3-day-streak',
    name: '3-Day Streak',
    description: 'Maintain your streak for 3 days',
    requiredStreak: 3,
    icon: <Flame className="h-5 w-5 text-orange-500" />
  },
  {
    id: '7-day-streak',
    name: 'Weekly Warrior',
    description: 'Keep your streak for a full week',
    requiredStreak: 7, 
    icon: <Award className="h-5 w-5 text-yellow-500" />
  },
  {
    id: '30-day-streak',
    name: 'Monthly Master',
    description: 'Maintain your streak for a month',
    requiredStreak: 30,
    icon: <Star className="h-5 w-5 text-yellow-500" />
  }
];

export default function StreakWidget() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);
  const [rewardsToClaim, setRewardsToClaim] = useState<Reward[]>([]);
  const [animation, setAnimation] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  useEffect(() => {
    // Check if there are new rewards to claim based on streak
    if (user?.streak !== undefined) {
      const newRewards = rewards.filter(reward => 
        reward.requiredStreak <= (user.streak || 0) && 
        !localStorage.getItem(`claimed-${reward.id}`)
      );
      
      setRewardsToClaim(newRewards);
      
      // Check if daily reward was claimed today
      const lastClaimed = localStorage.getItem('last-daily-claim');
      const today = new Date().toDateString();
      
      if (lastClaimed === today) {
        setClaimedToday(true);
      } else {
        setClaimedToday(false);
      }
    }
  }, [user?.streak]);

  const claimDailyReward = async () => {
    try {
      // Simulate API request to claim reward
      await apiRequest('POST', '/api/user/claim-daily-reward', {});
      
      // Update local storage
      localStorage.setItem('last-daily-claim', new Date().toDateString());
      setClaimedToday(true);
      
      // Trigger animations
      setShowConfetti(true);
      setAnimation(true);
      
      // Show toast
      toast({
        title: "Daily Reward Claimed!",
        description: "You've claimed your daily reward. Keep the streak going!",
        duration: 5000,
      });
      
      // Update the user data in the cache to reflect streak increase
      const currentUser = queryClient.getQueryData<User>(['/api/user']);
      if (currentUser) {
        queryClient.setQueryData(['/api/user'], {
          ...currentUser,
          streak: (currentUser.streak || 0) + 1
        });
      }
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
        setAnimation(false);
      }, 3000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: "Failed to claim reward",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const claimStreakReward = (reward: Reward) => {
    // Mark reward as claimed
    localStorage.setItem(`claimed-${reward.id}`, 'true');
    
    // Remove from claimable rewards
    setRewardsToClaim(prev => prev.filter(r => r.id !== reward.id));
    
    // Show toast
    toast({
      title: `${reward.name} Achieved!`,
      description: reward.description,
      duration: 5000,
    });
    
    // Trigger animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Calculate progress to next milestone
  const calculateNextMilestone = () => {
    const streak = user?.streak || 0;
    const nextMilestones = [1, 3, 7, 30, 90, 180, 365];
    const next = nextMilestones.find(m => m > streak) || (streak + 1);
    const prev = nextMilestones.filter(m => m <= streak).pop() || 0;
    
    return {
      next,
      progress: Math.floor(((streak - prev) / (next - prev)) * 100)
    };
  };

  const { next, progress } = calculateNextMilestone();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Daily Streak</span>
          </div>
          
          {rewardsToClaim.length > 0 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 text-yellow-500 border-yellow-500"
                onClick={() => claimStreakReward(rewardsToClaim[0])}
              >
                <Gift className="h-4 w-4" />
                <span>Claim Reward!</span>
              </Button>
            </motion.div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          {/* Confetti Animation */}
          <AnimatePresence>
            {showConfetti && (
              <motion.div 
                className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    initial={{
                      x: "50%",
                      y: "50%",
                      scale: 0
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: Math.random() * 2 + 0.5,
                      opacity: [1, 0.8, 0]
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeOut"
                    }}
                    style={{
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mb-6 text-center">
            <motion.div
              animate={animation ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-col items-center"
            >
              <div className="text-4xl font-bold mb-1 flex items-center">
                <motion.span
                  key={user?.streak}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {user?.streak || 0}
                </motion.span>
                <motion.div
                  animate={{ rotate: animation ? [0, 15, -15, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  className="ml-2"
                >
                  <Flame className="h-8 w-8 text-orange-500" />
                </motion.div>
              </div>
              <span className="text-muted-foreground">day streak</span>
            </motion.div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Progress to next milestone</span>
              <span>{user?.streak || 0} / {next} days</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              variant="default" 
              disabled={claimedToday}
              onClick={claimDailyReward}
            >
              {claimedToday ? "Reward Already Claimed Today" : "Claim Daily Reward"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 