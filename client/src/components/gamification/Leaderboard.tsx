import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  TrendingUp, 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Gift,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  level: number;
  score: number;
  changeDirection: 'up' | 'down' | 'none';
  streak?: number;
  achievements?: number;
  isCurrentUser?: boolean;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  users: LeaderboardUser[];
}

export function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('weekly');
  
  // Mock leaderboard data
  const leaderboardData: LeaderboardCategory[] = [
    {
      id: 'weekly',
      name: 'Weekly Progress',
      icon: TrendingUp,
      users: [
        { 
          id: '1', 
          name: 'Sarah Johnson', 
          rank: 1, 
          level: 8, 
          score: 1250, 
          changeDirection: 'up',
          streak: 15,
          achievements: 12
        },
        { 
          id: '2', 
          name: 'Mike Zhang', 
          rank: 2, 
          level: 7, 
          score: 980, 
          changeDirection: 'up',
          streak: 7,
          achievements: 9
        },
        { 
          id: '3', 
          name: 'Priya Sharma', 
          rank: 3, 
          level: 6, 
          score: 840, 
          changeDirection: 'down',
          streak: 10,
          achievements: 8
        },
        { 
          id: '4', 
          name: 'You', 
          rank: 4, 
          level: 5, 
          score: 720, 
          changeDirection: 'up',
          streak: 8,
          achievements: 7,
          isCurrentUser: true
        },
        { 
          id: '5', 
          name: 'Alex Chen', 
          rank: 5, 
          level: 5, 
          score: 680, 
          changeDirection: 'none',
          streak: 6,
          achievements: 8
        }
      ]
    },
    {
      id: 'streaks',
      name: 'Longest Streaks',
      icon: Flame,
      users: [
        { 
          id: '3', 
          name: 'Priya Sharma', 
          rank: 1, 
          level: 6, 
          score: 32, 
          changeDirection: 'up',
          streak: 32
        },
        { 
          id: '1', 
          name: 'Sarah Johnson', 
          rank: 2, 
          level: 8, 
          score: 24, 
          changeDirection: 'none',
          streak: 24
        },
        { 
          id: '6', 
          name: 'James Wilson', 
          rank: 3, 
          level: 4, 
          score: 18, 
          changeDirection: 'up',
          streak: 18
        },
        { 
          id: '2', 
          name: 'Mike Zhang', 
          rank: 4, 
          level: 7, 
          score: 16, 
          changeDirection: 'down',
          streak: 16
        },
        { 
          id: '4', 
          name: 'You', 
          rank: 8, 
          level: 5, 
          score: 8, 
          changeDirection: 'up',
          streak: 8,
          isCurrentUser: true
        }
      ]
    },
    {
      id: 'achievements',
      name: 'Most Achievements',
      icon: Trophy,
      users: [
        { 
          id: '1', 
          name: 'Sarah Johnson', 
          rank: 1, 
          level: 8, 
          score: 18, 
          changeDirection: 'none',
          achievements: 18
        },
        { 
          id: '6', 
          name: 'James Wilson', 
          rank: 2, 
          level: 4, 
          score: 15, 
          changeDirection: 'up',
          achievements: 15
        },
        { 
          id: '2', 
          name: 'Mike Zhang', 
          rank: 3, 
          level: 7, 
          score: 14, 
          changeDirection: 'down',
          achievements: 14
        },
        { 
          id: '4', 
          name: 'You', 
          rank: 6, 
          level: 5, 
          score: 7, 
          changeDirection: 'up',
          achievements: 7,
          isCurrentUser: true
        },
        { 
          id: '5', 
          name: 'Alex Chen', 
          rank: 7, 
          level: 5, 
          score: 6, 
          changeDirection: 'down',
          achievements: 6
        }
      ]
    }
  ];
  
  const getChangeIcon = (direction: string) => {
    switch(direction) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-700" />;
      default:
        return null;
    }
  };
  
  const currentCategory = leaderboardData.find(cat => cat.id === selectedCategory) || leaderboardData[0];
  const currentUserInLeaderboard = currentCategory.users.find(user => user.isCurrentUser);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="weekly" value={selectedCategory} onValueChange={setSelectedCategory}>
        <div className="px-6">
          <TabsList className="w-full grid grid-cols-3">
            {leaderboardData.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-1.5"
              >
                <category.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.id === 'weekly' ? 'XP' : (category.id === 'streaks' ? '🔥' : '🏆')}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {leaderboardData.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <CardContent className="px-0 pb-4">
              <div className="space-y-0">
                {category.users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center px-6 py-3 hover:bg-muted/50 relative ${
                      user.isCurrentUser ? 'bg-primary/5 border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank) || <span className="text-sm font-medium text-muted-foreground">{user.rank}</span>}
                    </div>
                    
                    <Avatar className="h-8 w-8 mr-3 border">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className={user.isCurrentUser ? 'bg-primary/20 text-primary' : ''}>
                          {user.name.substring(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className={`text-sm font-medium truncate ${user.isCurrentUser ? 'text-primary' : ''}`}>
                          {user.name}
                        </p>
                        <Badge variant="outline" className="ml-2 text-xs px-1 py-0">L{user.level}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {category.id === 'weekly' && (
                          <>
                            <span>{user.score} XP</span>
                          </>
                        )}
                        {category.id === 'streaks' && (
                          <>
                            <Flame className="h-3 w-3 text-orange-500 mr-1" />
                            <span>{user.streak}-day streak</span>
                          </>
                        )}
                        {category.id === 'achievements' && (
                          <>
                            <Star className="h-3 w-3 text-amber-500 mr-1" />
                            <span>{user.achievements} achievements</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium">
                      <div className="flex items-center gap-1 text-xs">
                        {getChangeIcon(user.changeDirection)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* "You" are not in top 5 */}
                {!currentUserInLeaderboard && (
                  <>
                    <div className="px-6 py-2">
                      <div className="border-t border-dashed" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center px-6 py-3 bg-primary/5 border-l-2 border-primary"
                    >
                      <div className="w-8 flex justify-center">
                        <span className="text-sm font-medium text-muted-foreground">12</span>
                      </div>
                      
                      <Avatar className="h-8 w-8 mr-3 border">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          YO
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium truncate text-primary">
                            You
                          </p>
                          <Badge variant="outline" className="ml-2 text-xs px-1 py-0">L5</Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {category.id === 'weekly' && (
                            <>
                              <span>435 XP</span>
                            </>
                          )}
                          {category.id === 'streaks' && (
                            <>
                              <Flame className="h-3 w-3 text-orange-500 mr-1" />
                              <span>8-day streak</span>
                            </>
                          )}
                          {category.id === 'achievements' && (
                            <>
                              <Star className="h-3 w-3 text-amber-500 mr-1" />
                              <span>7 achievements</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm font-medium">
                        <div className="flex items-center gap-1 text-xs">
                          {getChangeIcon('up')}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
              
              <div className="px-6 mt-4">
                <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  View Rewards
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
} 