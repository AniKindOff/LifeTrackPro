import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Award, 
  Clock, 
  Copy, 
  Crown, 
  Dices, 
  FileText, 
  Flame, 
  Gamepad2, 
  Heart, 
  HelpCircle, 
  Rocket, 
  Snowflake, 
  Star, 
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define card types
interface MemoryCard {
  id: number;
  value: string;
  icon: React.FC<{ className?: string }>;
  flipped: boolean;
  matched: boolean;
}

export function FocusGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [bestScore, setBestScore] = useState<{ [key: string]: { moves: number; time: number } }>({
    easy: { moves: Infinity, time: Infinity },
    medium: { moves: Infinity, time: Infinity },
    hard: { moves: Infinity, time: Infinity },
  });

  // Card icons and their corresponding components
  const iconComponents: { [key: string]: React.FC<{ className?: string }> } = {
    'heart': Heart,
    'star': Star,
    'rocket': Rocket,
    'zap': Zap,
    'crown': Crown,
    'flame': Flame,
    'snowflake': Snowflake,
    'gamepad': Gamepad2,
    'file': FileText,
    'copy': Copy,
    'award': Award,
    'help': HelpCircle,
  };

  // Initialize or reset the game
  const initializeGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGameStarted(false);
    setGameCompleted(false);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setDifficulty(difficulty);

    let pairCount = 6; // Easy: 6 pairs (12 cards)
    if (difficulty === 'medium') pairCount = 8; // Medium: 8 pairs (16 cards)
    if (difficulty === 'hard') pairCount = 12; // Hard: 12 pairs (24 cards)

    // Get random icons
    const iconKeys = Object.keys(iconComponents);
    const selectedIcons = [...iconKeys]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairCount);

    // Create pairs
    const cardPairs = selectedIcons.flatMap((icon, index) => [
      {
        id: index * 2,
        value: icon,
        icon: iconComponents[icon],
        flipped: false,
        matched: false,
      },
      {
        id: index * 2 + 1,
        value: icon,
        icon: iconComponents[icon],
        flipped: false,
        matched: false,
      },
    ]);

    // Shuffle the cards
    const shuffledCards = [...cardPairs].sort(() => 0.5 - Math.random());
    setCards(shuffledCards);
    setMatchedPairs(0);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setTimer(0);
  };

  // Effect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);

  // Effect to check for game completion
  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      setGameCompleted(true);
      
      // Update best score
      const currentScore = { moves, time: timer };
      const previousBest = bestScore[difficulty];
      
      if (moves < previousBest.moves || (moves === previousBest.moves && timer < previousBest.time)) {
        setBestScore({
          ...bestScore,
          [difficulty]: { moves, time: timer },
        });
      }
    }
  }, [matchedPairs, cards.length, bestScore, difficulty, moves, timer]);

  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow more than 2 cards flipped at once
    if (flippedCards.length === 2) return;
    
    // Don't allow clicking on already matched or flipped cards
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.matched || clickedCard.flipped) return;
    
    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // If this is the second card, increment moves
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      // Check if the cards match
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(card => card.id === firstId);
      const secondCard = newCards.find(card => card.id === secondId);
      
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Cards match
        setTimeout(() => {
          setCards(cards => cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true, flipped: false }
              : card
          ));
          setMatchedPairs(matchedPairs + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // Cards don't match, flip them back
        setTimeout(() => {
          setCards(cards => cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate star rating based on moves and difficulty
  const calculateStars = () => {
    const maxMoves = {
      easy: { three: 10, two: 14 }, // 3 stars: ≤10 moves, 2 stars: ≤14 moves, 1 star: >14 moves
      medium: { three: 16, two: 22 },
      hard: { three: 26, two: 34 },
    };
    
    if (moves <= maxMoves[difficulty].three) return 3;
    if (moves <= maxMoves[difficulty].two) return 2;
    return 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => window.history.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Memory Match</h1>
          <Badge variant="outline" className="ml-2">Focus Training</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            onClick={() => initializeGame('easy')}
          >
            Easy
          </Button>
          <Button
            size="sm"
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            onClick={() => initializeGame('medium')}
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            onClick={() => initializeGame('hard')}
          >
            Hard
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Memory Match Game</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Dices className="h-4 w-4" />
                <span>{moves} Moves</span>
              </div>
              {matchedPairs > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{matchedPairs} Pairs</span>
                </div>
              )}
            </div>
          </div>
          <CardDescription>
            Match pairs of cards to improve your focus and memory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!gameStarted && !gameCompleted && cards.length === 0 && (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Gamepad2 className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Focus Training Game</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Challenge your memory and focus by matching pairs of cards. 
                The faster you complete with fewer moves, the higher your score!
              </p>
              <Button size="lg" onClick={() => initializeGame('easy')}>
                Start Game
              </Button>
            </div>
          )}
          
          {!gameStarted && !gameCompleted && cards.length > 0 && (
            <div className="p-12 text-center">
              <h2 className="text-xl font-semibold mb-4">Ready to Play?</h2>
              <p className="text-muted-foreground mb-6">
                Find all {cards.length / 2} matching pairs with as few moves as possible.
              </p>
              <Button size="lg" onClick={startGame}>
                Start Game
              </Button>
            </div>
          )}
          
          {gameStarted && !gameCompleted && (
            <div className={cn(
              "grid gap-4 justify-center mx-auto",
              difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-6'
            )}>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  className={cn(
                    "relative cursor-pointer",
                    card.matched && "opacity-80"
                  )}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div 
                    className={cn(
                      "h-16 w-16 sm:h-20 sm:w-20 rounded-lg flex items-center justify-center transition-transform duration-300",
                      card.flipped ? "bg-primary text-primary-foreground" : "bg-muted",
                      card.matched && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    )}
                    style={{
                      transform: card.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {card.flipped || card.matched ? (
                      <card.icon className="h-8 w-8" />
                    ) : (
                      <span className="text-2xl font-bold">?</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {gameCompleted && (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
                <p className="text-muted-foreground mb-4">
                  You completed the {difficulty} level in {formatTime(timer)} with {moves} moves!
                </p>
                
                <div className="flex justify-center mb-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + i * 0.2 }}
                    >
                      <Star 
                        className={cn(
                          "h-8 w-8 mx-1",
                          i < calculateStars() ? "text-amber-500 fill-amber-500" : "text-muted"
                        )} 
                      />
                    </motion.div>
                  ))}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
                  <Card className="bg-muted/40">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Best Score ({difficulty})</p>
                      <div className="font-semibold">
                        {bestScore[difficulty].moves === Infinity 
                          ? "No record yet" 
                          : `${bestScore[difficulty].moves} moves in ${formatTime(bestScore[difficulty].time)}`
                        }
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/40">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">Current Score</p>
                      <div className="font-semibold">
                        {moves} moves in {formatTime(timer)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => initializeGame(difficulty)}>
                  Play Again
                </Button>
                <Button variant="outline" onClick={() => initializeGame(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')}>
                  Try {difficulty === 'easy' ? 'Medium' : difficulty === 'medium' ? 'Hard' : 'Easy'} Level
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        {gameStarted && !gameCompleted && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                if (confirm("Are you sure you want to restart the game?")) {
                  initializeGame(difficulty);
                }
              }}
            >
              Restart
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirm("Are you sure you want to quit the game?")) {
                  setGameStarted(false);
                  setCards([]);
                }
              }}
            >
              Quit
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
} 