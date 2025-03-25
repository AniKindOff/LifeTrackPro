import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRiya } from '@/hooks/use-riya';
import { CheckCircle2, CheckCircle, Target, Award, Coins, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

export function DailyChallenges() {
  const { dailyChallenge } = useRiya();
  const [userCoins, setUserCoins] = useState(150);
  const [challenges, setChallenges] = useState([
    {
      id: '1',
      title: 'Track Expenses',
      description: 'Record all your expenses for today',
      difficulty: 'easy',
      progress: 75,
      maxProgress: 100,
      reward: { xp: 50, coins: 25 },
      completed: false,
      claimed: false
    },
    {
      id: '2',
      title: 'Budget Planning',
      description: 'Create a monthly budget plan',
      difficulty: 'medium',
      progress: 100,
      maxProgress: 100,
      reward: { xp: 100, coins: 50 },
      completed: true,
      claimed: true
    },
    {
      id: '3',
      title: 'Financial Goal',
      description: dailyChallenge || 'Set a new savings goal',
      difficulty: 'hard',
      progress: 0,
      maxProgress: 100,
      reward: { xp: 150, coins: 75 },
      completed: false,
      claimed: false
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const handleProgressUpdate = (id: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.id === id) {
          const newProgress = Math.min(challenge.progress + 25, challenge.maxProgress);
          const completed = newProgress >= challenge.maxProgress;
          
          // Play confetti animation if challenge is completed
          if (completed && !challenge.completed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          
          return {
            ...challenge,
            progress: newProgress,
            completed
          };
        }
        return challenge;
      })
    );
  };
  
  const claimReward = (id: string) => {
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => {
        if (challenge.id === id && challenge.completed && !challenge.claimed) {
          // Add coins to user's balance
          setUserCoins(prev => prev + challenge.reward.coins);
          
          // Play confetti animation
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
          
          return { ...challenge, claimed: true };
        }
        return challenge;
      })
    );
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Challenges
          </CardTitle>
          <Badge variant="outline" className="px-3">
            {challenges.filter(c => c.completed).length}/{challenges.length} Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={itemVariants}
              transition={{ duration: 0.3 }}
              className={`bg-card border rounded-lg p-4 ${challenge.completed ? 'border-green-500/30' : 'border-muted'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{challenge.title}</h3>
                    {challenge.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {challenge.description}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={getDifficultyColor(challenge.difficulty)}
                >
                  {challenge.difficulty}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress 
                    value={challenge.progress} 
                    className={`h-2 ${challenge.completed ? 'bg-green-500/20' : ''}`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      <span>{challenge.reward.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Coins className="h-3.5 w-3.5 text-yellow-500" />
                      <span>{challenge.reward.coins}</span>
                    </div>
                  </div>

                  {challenge.completed ? (
                    challenge.claimed ? (
                      <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>Claimed</span>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => claimReward(challenge.id)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                      >
                        <Gift className="h-4 w-4 mr-1.5" />
                        Claim Reward
                      </Button>
                    )
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        size="sm"
                        onClick={() => handleProgressUpdate(challenge.id)}
                        className="gap-1.5"
                      >
                        <Target className="h-3.5 w-3.5" />
                        Update Progress
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-6 border-t pt-4">
          <Button 
            variant="outline"
            className="w-full gap-2"
          >
            <Gift className="h-4 w-4" />
            View More Challenges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 