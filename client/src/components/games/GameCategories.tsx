import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Calculator, 
  Puzzle, 
  Brain, 
  HeartPulse,
  Dices,
  Sparkles
} from 'lucide-react';

// Import game components
import { FocusGame } from './FocusGame';
import { MathGame } from './MathGame';
import { MemoryGame } from './MemoryGame';
import { MeditationGame } from './MeditationGame';
import { WordGame } from './WordGame';

type GameType = 'focus' | 'math' | 'memory' | 'meditation' | 'word';
type GameCategory = 'serious' | 'fun' | 'relaxation';

export function GameCategories() {
  const [showGame, setShowGame] = useState(false);
  const [activeGameType, setActiveGameType] = useState<GameType>('focus');
  const [activeTab, setActiveTab] = useState<GameCategory>('fun');
  
  // Game definitions - organized by category
  const games = {
    serious: [
      { 
        type: 'focus' as GameType, 
        name: 'Focus Training', 
        description: 'Improve your focus and attention span', 
        icon: <Target className="size-5" /> 
      },
      { 
        type: 'math' as GameType, 
        name: 'Math Challenge', 
        description: 'Test and enhance your calculation skills', 
        icon: <Calculator className="size-5" /> 
      }
    ],
    fun: [
      { 
        type: 'word' as GameType, 
        name: 'Word Scramble', 
        description: 'Unscramble words and have fun', 
        icon: <Puzzle className="size-5" /> 
      },
      { 
        type: 'dices' as GameType, 
        name: 'Coming Soon: Dice Game', 
        description: 'Roll the dice and test your luck', 
        icon: <Dices className="size-5" />,
        disabled: true
      }
    ],
    relaxation: [
      { 
        type: 'memory' as GameType, 
        name: 'Memory Game', 
        description: 'Enhance your memory with matching pairs', 
        icon: <Brain className="size-5" /> 
      },
      { 
        type: 'meditation' as GameType, 
        name: 'Mind Relaxation', 
        description: 'Calm your mind with guided breathing', 
        icon: <HeartPulse className="size-5" /> 
      }
    ]
  };
  
  const startGame = (type: GameType) => {
    setActiveGameType(type);
    setShowGame(true);
    
    // Scroll to the game section
    setTimeout(() => {
      document.getElementById('game-container')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const backToGames = () => {
    setShowGame(false);
  };
  
  const renderGame = () => {
    switch (activeGameType) {
      case 'focus':
        return <FocusGame onBack={backToGames} />;
      case 'math':
        return <MathGame onBack={backToGames} />;
      case 'memory':
        return <MemoryGame onBack={backToGames} />;
      case 'meditation':
        return <MeditationGame onBack={backToGames} />;
      case 'word':
        return <WordGame onBack={backToGames} />;
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Brain Games</h1>
        <p className="text-muted-foreground">Play games to enhance cognitive skills and earn rewards</p>
      </div>
      
      <Tabs defaultValue="fun" value={activeTab} onValueChange={(value) => setActiveTab(value as GameCategory)}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="fun" className="flex items-center gap-1.5">
              <Dices className="h-4 w-4" />
              Fun Games
            </TabsTrigger>
            <TabsTrigger value="serious" className="flex items-center gap-1.5">
              <Brain className="h-4 w-4" />
              Brain Training
            </TabsTrigger>
            <TabsTrigger value="relaxation" className="flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4" />
              Relaxation
            </TabsTrigger>
          </TabsList>
          
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Earn coins by playing games
          </Badge>
        </div>
        
        {Object.entries(games).map(([category, categoryGames]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryGames.map((game) => (
                <Card key={game.type} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          {game.icon}
                        </div>
                        {game.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription>{game.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-amber-500">+25 coins per win</span>
                    </div>
                    <Button 
                      onClick={() => startGame(game.type)}
                      className="bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90"
                    >
                      Play Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {showGame && (
        <div 
          id="game-container"
          className="mt-8 p-6 bg-card rounded-lg border shadow-lg animate-in fade-in-50 duration-300"
        >
          {renderGame()}
        </div>
      )}
    </div>
  );
} 