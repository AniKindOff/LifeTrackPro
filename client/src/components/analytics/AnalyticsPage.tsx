import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Dumbbell,
  Brain,
  Heart,
  Moon,
  Sun,
  Trophy,
  Calculator,
  Eye
} from 'lucide-react';
import { FocusGame } from '@/components/games/FocusGame';
import { MathGame } from '@/components/games/MathGame';
import { MemoryGame } from '@/components/games/MemoryGame';
import { MeditationGame } from '@/components/games/MeditationGame';
import { WordGame } from '@/components/games/WordGame';
import { motion } from 'framer-motion';

type ChartType = 'bar' | 'line' | 'pie';
type TimeRange = 'week' | 'month' | 'year';
type GameType = 'focus' | 'math' | 'memory' | 'meditation' | 'word';
type GameCategory = 'serious' | 'fun' | 'relaxation';

export function AnalyticsPage() {
  const [showGame, setShowGame] = useState(false);
  const [activeGameType, setActiveGameType] = useState<GameType>('focus');
  const [activeGameCategory, setActiveGameCategory] = useState<GameCategory>('serious');
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  const [showAnimatedBackground, setShowAnimatedBackground] = useState(true);
  
  // Mock data for charts
  const mockData = {
    productivity: [65, 75, 70, 90, 80, 85, 95],
    habits: [80, 75, 85, 82, 90, 88, 92],
    focus: [60, 65, 70, 75, 80, 85, 90],
    sleep: [7, 6.5, 7.5, 8, 7.8, 7.2, 8.5],
    mood: [7, 8, 6, 7, 9, 8, 9]
  };
  
  // Game definitions - organized by category
  const games = {
    serious: [
      { 
        type: 'focus', 
        name: 'Focus Training', 
        description: 'Improve your focus and attention span', 
        icon: 'target' 
      },
      { 
        type: 'math', 
        name: 'Math Challenge', 
        description: 'Test and enhance your calculation skills', 
        icon: 'calculator' 
      }
    ],
    fun: [
      { 
        type: 'word', 
        name: 'Word Scramble', 
        description: 'Unscramble words and have fun', 
        icon: 'puzzle-piece' 
      }
    ],
    relaxation: [
      { 
        type: 'memory', 
        name: 'Memory Game', 
        description: 'Enhance your memory with matching pairs', 
        icon: 'brain' 
      },
      { 
        type: 'meditation', 
        name: 'Mind Relaxation', 
        description: 'Calm your mind with guided breathing', 
        icon: 'heart-pulse' 
      }
    ]
  };
  
  // Start a game
  const startGame = (type: GameType, category: GameCategory) => {
    setActiveGameType(type);
    setActiveGameCategory(category);
    setShowGame(true);
  };
  
  // Back to analytics
  const backToAnalytics = () => {
    setShowGame(false);
  };
  
  // Toggle animated background
  const toggleAnimatedBackground = () => {
    setShowAnimatedBackground(!showAnimatedBackground);
  };
  
  // Render animated background
  const renderAnimatedBackground = () => {
    if (!showAnimatedBackground) return null;
    
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/80 backdrop-blur-3xl"></div>
        
        {/* Animated circles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5, 1],
              opacity: [0.1, Math.random() * 0.5 + 0.1, 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
        
        {/* Neon lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            style={{
              width: `${Math.random() * 40 + 20}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 180}deg)`
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              width: [`${Math.random() * 40 + 20}%`, `${Math.random() * 60 + 30}%`, `${Math.random() * 40 + 20}%`]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    );
  };
  
  // Render a specific game based on activeGameType
  const renderGame = () => {
    switch (activeGameType) {
      case 'focus':
        return <FocusGame />;
      case 'math':
        return <MathGame />;
      case 'memory':
        return <MemoryGame />;
      case 'meditation':
        return <MeditationGame />;
      case 'word':
        return <WordGame />;
      default:
        return <FocusGame />;
    }
  };
  
  // Render chart based on type and dataset
  function renderChart(type: ChartType, dataSet: keyof typeof mockData) {
    const data = mockData[dataSet];
    
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-between h-full w-full">
            {data.map((item, i) => {
              const value = 'value' in item ? item.value : 
                           'completion' in item ? item.completion : 
                           'hours' in item ? item.hours * 10 : 0;
              
              const label = 'day' in item ? item.day : 
                          'name' in item ? item.name : '';
              
              return (
                <div key={i} className="flex flex-col items-center gap-2 relative">
                  <div 
                    className="w-12 rounded-t-md bg-primary" 
                    style={{ height: `${value * 2}px` }}
                  />
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        );
        
      case 'line':
        const maxValue = Math.max(...data.map(item => 
          'value' in item ? item.value : 
          'completion' in item ? item.completion : 
          'hours' in item ? item.hours * 10 : 0
        ));
        
        const points = data.map((item, i) => {
          const value = 'value' in item ? item.value : 
                       'completion' in item ? item.completion : 
                       'hours' in item ? item.hours * 10 : 0;
          
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((value / maxValue) * 100);
          return `${x},${y}`;
        }).join(' ');
        
        return (
          <div className="h-full w-full flex flex-col">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={points}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex justify-between mt-2">
              {data.map((item, i) => {
                const label = 'day' in item ? item.day : 
                            'name' in item ? item.name : '';
                return (
                  <span key={i} className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        );
        
      case 'pie':
        const total = data.reduce((sum, item) => 
          sum + ('value' in item ? item.value : 
                'completion' in item ? item.completion : 
                'hours' in item ? item.hours : 0), 0);
        
        let cumulativePercent = 0;
        
        // Generate colors based on primary with varying saturation/lightness
        const getColor = (index: number) => {
          const hue = `var(--${['primary', 'amber', 'emerald', 'indigo', 'rose'][index % 5] || 'primary'})`;
          return `hsl(${hue}`;
        };
        
        const segments = data.map((item, i) => {
          const value = 'value' in item ? item.value : 
                       'completion' in item ? item.completion : 
                       'hours' in item ? item.hours : 0;
          
          const percent = (value / total) * 100;
          const startPercent = cumulativePercent;
          cumulativePercent += percent;
          
          return {
            color: getColor(i),
            startPercent,
            endPercent: cumulativePercent,
            label: 'day' in item ? item.day : 'name' in item ? item.name : '',
            value
          };
        });
        
        return (
          <div className="flex items-center justify-around h-full w-full">
            <div className="relative w-[250px] h-[250px]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {segments.map((segment, i) => {
                  const startAngle = (segment.startPercent / 100) * 360;
                  const endAngle = (segment.endPercent / 100) * 360;
                  
                  // Convert angles to radians and calculate x,y
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  
                  // Path for arc
                  const d = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(" ");
                  
                  return (
                    <path
                      key={i}
                      d={d}
                      fill={`hsl(var(--${['primary', 'amber', 'emerald', 'indigo', 'rose'][i % 5]}))`}
                      stroke="hsl(var(--background))"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="flex flex-col gap-2">
              {segments.map((segment, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: `hsl(var(--${['primary', 'amber', 'emerald', 'indigo', 'rose'][i % 5]}))` }}
                  />
                  <span className="text-sm">{segment.label} ({Math.round(segment.value)})</span>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  }

  // Show game or analytics
  if (showGame) {
    return (
      <div className="space-y-6">
        {renderAnimatedBackground()}
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={backToAnalytics}
            className="mb-4"
          >
            ← Back to Analytics
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAnimatedBackground}
            title={showAnimatedBackground ? "Disable animated background" : "Enable animated background"}
          >
            <div className="size-4 rounded-full border border-current grid place-items-center">
              {showAnimatedBackground ? "✓" : ""}
            </div>
          </Button>
        </div>
        
        {renderGame()}
      </div>
    );
  }

  // Analytics view
  return (
    <div className="space-y-6">
      {renderAnimatedBackground()}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAnimatedBackground}
            title={showAnimatedBackground ? "Disable animated background" : "Enable animated background"}
          >
            <div className="size-4 rounded-full border border-current grid place-items-center">
              {showAnimatedBackground ? "✓" : ""}
            </div>
          </Button>
          
          <Select
            value={selectedTimeRange}
            onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={selectedChartType}
            onValueChange={(value) => setSelectedChartType(value as ChartType)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="pie">Pie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="productivity">
        <TabsList className="mb-4">
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
        </TabsList>
        
        <TabsContent value="productivity">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Score</CardTitle>
              <CardDescription>
                Your productivity over the past {selectedTimeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderChart(selectedChartType, 'productivity')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits">
          <Card>
            <CardHeader>
              <CardTitle>Habit Consistency</CardTitle>
              <CardDescription>
                How consistently you've maintained your habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderChart(selectedChartType, 'habits')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="focus">
          <Card>
            <CardHeader>
              <CardTitle>Focus Metrics</CardTitle>
              <CardDescription>
                Your focus and deep work sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderChart(selectedChartType, 'focus')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Quality</CardTitle>
              <CardDescription>
                Hours of sleep per night
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderChart(selectedChartType, 'sleep')}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Mood Tracking</CardTitle>
              <CardDescription>
                Your mood patterns over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderChart(selectedChartType, 'mood')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Games Section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">Brain Training & Fun Games</h2>
        
        {/* Game Categories */}
        <Tabs defaultValue="serious">
          <TabsList className="mb-4">
            <TabsTrigger value="serious">Serious Training</TabsTrigger>
            <TabsTrigger value="fun">Fun Games</TabsTrigger>
            <TabsTrigger value="relaxation">Mind Relaxation</TabsTrigger>
          </TabsList>
          
          {/* Serious Games */}
          <TabsContent value="serious">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.serious.map((game) => (
                <Card key={game.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span role="img" aria-label={game.name}>
                        {game.icon === 'target' ? '🎯' : 
                         game.icon === 'calculator' ? '🧮' : '🎮'}
                      </span>
                      {game.name}
                    </CardTitle>
                    <CardDescription>
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => startGame(game.type as GameType, 'serious')}
                      className="w-full"
                    >
                      Play Game
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Fun Games */}
          <TabsContent value="fun">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.fun.map((game) => (
                <Card key={game.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span role="img" aria-label={game.name}>
                        {game.icon === 'puzzle-piece' ? '🧩' : '🎮'}
                      </span>
                      {game.name}
                    </CardTitle>
                    <CardDescription>
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => startGame(game.type as GameType, 'fun')}
                      className="w-full"
                    >
                      Play Game
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Relaxation Games */}
          <TabsContent value="relaxation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.relaxation.map((game) => (
                <Card key={game.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span role="img" aria-label={game.name}>
                        {game.icon === 'brain' ? '🧠' : 
                         game.icon === 'heart-pulse' ? '💆' : '🎮'}
                      </span>
                      {game.name}
                    </CardTitle>
                    <CardDescription>
                      {game.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => startGame(game.type as GameType, 'relaxation')}
                      className="w-full"
                    >
                      Start Session
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 