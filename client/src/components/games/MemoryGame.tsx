import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Brain, Clock, Trophy, Check, ThumbsUp, Eye } from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';

type GameLevel = 'easy' | 'medium' | 'hard' | 'expert';

interface Symbol {
  id: number;
  emoji: string;
  isShown: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const { addReward } = useRiya();
  const [level, setLevel] = useState<GameLevel>('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [memorizeTime, setMemorizeTime] = useState(0);
  const [memorizing, setMemorizing] = useState(false);
  const [bestScores, setBestScores] = useState<Record<GameLevel, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0
  });
  
  // Level configurations
  const levelConfig = {
    easy: { boardSize: 4, memorizeTime: 5, gameTime: 60 },
    medium: { boardSize: 6, memorizeTime: 8, gameTime: 90 },
    hard: { boardSize: 8, memorizeTime: 10, gameTime: 120 },
    expert: { boardSize: 10, memorizeTime: 15, gameTime: 150 }
  };
  
  // Load best scores from localStorage
  useEffect(() => {
    const savedBestScores = localStorage.getItem('memory_game_best_scores');
    if (savedBestScores) {
      setBestScores(JSON.parse(savedBestScores));
    }
  }, []);
  
  // Save best scores to localStorage
  useEffect(() => {
    localStorage.setItem('memory_game_best_scores', JSON.stringify(bestScores));
  }, [bestScores]);
  
  // Timer for memorizing phase
  useEffect(() => {
    if (memorizing && memorizeTime > 0) {
      const timer = setTimeout(() => {
        setMemorizeTime(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (memorizing && memorizeTime === 0) {
      hideAllSymbols();
      setMemorizing(false);
      startGame();
    }
  }, [memorizing, memorizeTime]);
  
  // Timer for game phase
  useEffect(() => {
    if (gameStarted && !gameOver && !memorizing && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (gameStarted && !gameOver && !memorizing && timeLeft === 0) {
      endGame(false);
    }
  }, [gameStarted, gameOver, memorizing, timeLeft]);
  
  // Check for win condition
  useEffect(() => {
    if (gameStarted && !gameOver && !memorizing && symbols.length > 0) {
      const allMatched = symbols.every(symbol => symbol.isMatched);
      if (allMatched) {
        endGame(true);
      }
    }
  }, [symbols, gameStarted, gameOver, memorizing]);
  
  // Generate a random set of emoji pairs
  const generateSymbols = (boardSize: number) => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🕷️', '🦂', '🦀', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐠', '🐟', '🐡', '🐬', '🐳', '🐋', '🦈'];
    
    const pairsCount = (boardSize * boardSize) / 2;
    const selectedEmojis = emojis.sort(() => 0.5 - Math.random()).slice(0, pairsCount);
    
    // Create pairs of each emoji
    let pairs: Symbol[] = [];
    selectedEmojis.forEach((emoji, index) => {
      // Create two instances of each emoji
      pairs.push({ id: index * 2, emoji, isShown: true, isMatched: false });
      pairs.push({ id: index * 2 + 1, emoji, isShown: true, isMatched: false });
    });
    
    // Shuffle the pairs
    return pairs.sort(() => 0.5 - Math.random());
  };
  
  // Initialize the game with a memorizing phase
  const initializeGame = () => {
    const config = levelConfig[level];
    const newSymbols = generateSymbols(config.boardSize);
    
    setSymbols(newSymbols);
    setMemorizeTime(config.memorizeTime);
    setTimeLeft(config.gameTime);
    setMoves(0);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setMemorizing(true);
    setGameStarted(true);
  };
  
  // Start the actual game after memorizing
  const startGame = () => {
    setGameStarted(true);
  };
  
  // Hide all symbols at the end of memorizing phase
  const hideAllSymbols = () => {
    setSymbols(prev => prev.map(symbol => ({
      ...symbol,
      isShown: false
    })));
  };
  
  // Toggle a symbol when clicked
  const toggleSymbol = (id: number) => {
    // Get visible but unmatched symbols
    const visibleSymbols = symbols.filter(s => s.isShown && !s.isMatched);
    
    // If already two shown, do nothing
    if (visibleSymbols.length >= 2) return;
    
    // Find the clicked symbol
    const symbolIndex = symbols.findIndex(s => s.id === id);
    if (symbolIndex === -1 || symbols[symbolIndex].isShown || symbols[symbolIndex].isMatched) return;
    
    // Show the clicked symbol
    const newSymbols = [...symbols];
    newSymbols[symbolIndex] = {
      ...newSymbols[symbolIndex],
      isShown: true
    };
    
    setSymbols(newSymbols);
    
    // After showing the symbol, check if this is the second one shown
    const updatedVisibleSymbols = newSymbols.filter(s => s.isShown && !s.isMatched);
    if (updatedVisibleSymbols.length === 2) {
      // Increment moves
      setMoves(prev => prev + 1);
      
      // Check for a match
      const [first, second] = updatedVisibleSymbols;
      if (first.emoji === second.emoji) {
        // Match found, update symbols as matched
        setTimeout(() => {
          setSymbols(prev => prev.map(s => 
            (s.id === first.id || s.id === second.id)
              ? { ...s, isMatched: true }
              : s
          ));
          
          // Update score
          const scoreIncrease = calculateScoreIncrease();
          setScore(prev => prev + scoreIncrease);
        }, 500);
      } else {
        // No match, hide after a delay
        setTimeout(() => {
          setSymbols(prev => prev.map(s => 
            (s.id === first.id || s.id === second.id)
              ? { ...s, isShown: false }
              : s
          ));
        }, 1000);
      }
    }
  };
  
  // Calculate score increase based on level and speed
  const calculateScoreIncrease = () => {
    const levelMultiplier = {
      easy: 10,
      medium: 20,
      hard: 30,
      expert: 50
    };
    
    return levelMultiplier[level];
  };
  
  // End the game (win or lose)
  const endGame = (won: boolean) => {
    setGameOver(true);
    setGameWon(won);
    
    // If won, check if it's a new best score
    if (won && score > bestScores[level]) {
      setBestScores(prev => ({ ...prev, [level]: score }));
      
      // Give reward for new best score
      addReward(score, `New high score in Memory Game (${level})`);
    }
    
    // Reveal all symbols
    setSymbols(prev => prev.map(symbol => ({
      ...symbol,
      isShown: true
    })));
  };
  
  // Get border color for a symbol card
  const getSymbolBorderColor = (symbol: Symbol) => {
    if (symbol.isMatched) return 'border-green-500';
    if (symbol.isShown) return 'border-primary';
    return 'border-transparent';
  };
  
  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="size-5" />
              Memory Game
            </CardTitle>
            <CardDescription>
              Test your visual memory by memorizing and matching symbols
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Select Difficulty</h3>
                <div className="flex gap-2 flex-wrap">
                  {(['easy', 'medium', 'hard', 'expert'] as GameLevel[]).map((lvl) => (
                    <Button
                      key={lvl}
                      variant={level === lvl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLevel(lvl)}
                      className="capitalize"
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Grid Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{levelConfig[level].boardSize}×{levelConfig[level].boardSize}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.pow(levelConfig[level].boardSize, 2)} tiles total
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Best Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{bestScores[level]}</p>
                    <p className="text-xs text-muted-foreground">
                      on {level} difficulty
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col gap-1 text-sm">
                <p><span className="font-medium">How to play:</span> Memorize the emoji positions, then find matching pairs.</p>
                <p><span className="font-medium">1.</span> You'll see all emojis for {levelConfig[level].memorizeTime} seconds</p>
                <p><span className="font-medium">2.</span> After they're hidden, click to reveal and match pairs</p>
                <p><span className="font-medium">3.</span> Complete the grid before time runs out!</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={initializeGame} 
              className="w-full"
              size="lg"
            >
              Start Game
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="size-6" />
              Memory Game
            </h2>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="size-4 mr-1" />
                {memorizing ? `Memorize: ${memorizeTime}s` : `Time: ${timeLeft}s`}
              </Badge>
              
              <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary">
                <Trophy className="size-4 mr-1" />
                {score}
              </Badge>
              
              <Badge variant="outline" className="px-3 py-1">
                Moves: {moves}
              </Badge>
            </div>
          </div>
          
          {memorizing && (
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="size-5 text-primary" />
                <h3 className="font-medium">Memorization Phase</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Remember the position of each emoji! You have {memorizeTime} seconds left.
              </p>
            </div>
          )}
          
          {gameOver && (
            <div className={`${gameWon ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-4 text-center`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {gameWon ? (
                  <ThumbsUp className="size-5 text-green-600" />
                ) : (
                  <AlertCircle className="size-5 text-red-600" />
                )}
                <h3 className="font-medium">{gameWon ? 'Congratulations!' : 'Game Over'}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {gameWon 
                  ? `You won with a score of ${score}! It took you ${moves} moves.` 
                  : `You ran out of time. You matched ${symbols.filter(s => s.isMatched).length / 2} pairs out of ${symbols.length / 2}.`
                }
              </p>
            </div>
          )}
          
          <div className={`grid grid-cols-${Math.min(levelConfig[level].boardSize, 6)} gap-2 md:gap-3`} style={{ 
            gridTemplateColumns: `repeat(${Math.min(levelConfig[level].boardSize, 6)}, minmax(0, 1fr))`
          }}>
            {symbols.map((symbol) => (
              <motion.div
                key={symbol.id}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  className={`aspect-square w-full text-2xl md:text-3xl ${getSymbolBorderColor(symbol)} ${symbol.isMatched ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                  onClick={() => !gameOver && !memorizing && !symbol.isMatched && toggleSymbol(symbol.id)}
                  disabled={gameOver || memorizing || symbol.isMatched || symbol.isShown}
                >
                  {symbol.isShown || symbol.isMatched ? symbol.emoji : '?'}
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{memorizing ? 'Memorization time' : 'Time remaining'}</span>
              <span>{memorizing ? memorizeTime : timeLeft}s</span>
            </div>
            <Progress 
              value={memorizing 
                ? (memorizeTime / levelConfig[level].memorizeTime) * 100 
                : (timeLeft / levelConfig[level].gameTime) * 100
              } 
              className="h-2" 
            />
          </div>
          
          {gameOver && (
            <div className="flex justify-center gap-4">
              <Button onClick={initializeGame}>
                Play Again
              </Button>
              <Button variant="outline" onClick={() => setGameStarted(false)}>
                Change Difficulty
              </Button>
            </div>
          )}
          
          {!gameOver && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setGameStarted(false);
                  setGameOver(false);
                  setMemorizing(false);
                }}
              >
                Quit Game
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 