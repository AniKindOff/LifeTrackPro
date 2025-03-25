import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Puzzle, Clock, Trophy, Zap, Sparkles, RefreshCw, RotateCw, Check, X, Music, VolumeX, Volume2 } from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Word {
  original: string;
  scrambled: string;
  hint: string;
  category: string;
}

export function WordGame() {
  const { addReward } = useRiya();
  
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [bestScore, setBestScore] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [showAnimatedAnswer, setShowAnimatedAnswer] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [resultsOpen, setResultsOpen] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Word lists by difficulty
  const wordLists: Record<Difficulty, Word[]> = {
    easy: [
      { original: 'happy', scrambled: 'ypahp', hint: 'Feeling joy', category: 'emotions' },
      { original: 'beach', scrambled: 'chabe', hint: 'Sandy shore', category: 'places' },
      { original: 'apple', scrambled: 'pleap', hint: 'A common fruit', category: 'food' },
      { original: 'dream', scrambled: 'ardem', hint: 'What you see when sleeping', category: 'mind' },
      { original: 'music', scrambled: 'csium', hint: 'Pleasant sounds', category: 'arts' },
      { original: 'smile', scrambled: 'mleis', hint: 'Expression of joy', category: 'emotions' },
      { original: 'laugh', scrambled: 'ghalú', hint: 'Sound of joy', category: 'emotions' },
      { original: 'dance', scrambled: 'ecand', hint: 'Moving to music', category: 'activity' }
    ],
    medium: [
      { original: 'sunshine', scrambled: 'hnuisesn', hint: 'Bright light from the sky', category: 'nature' },
      { original: 'mountain', scrambled: 'nntuoami', hint: 'A tall landform', category: 'nature' },
      { original: 'exercise', scrambled: 'eecsexir', hint: 'Physical activity', category: 'health' },
      { original: 'journey', scrambled: 'yojreun', hint: 'A trip or adventure', category: 'travel' },
      { original: 'balance', scrambled: 'acenlba', hint: 'Equal distribution', category: 'concept' },
      { original: 'mindful', scrambled: 'nfliudm', hint: 'Being present', category: 'wellness' },
      { original: 'gratitude', scrambled: 'tdrgeauit', hint: 'Being thankful', category: 'emotions' },
      { original: 'creative', scrambled: 'vaeertci', hint: 'Making something new', category: 'skills' }
    ],
    hard: [
      { original: 'motivation', scrambled: 'aovittinom', hint: 'Drive to achieve goals', category: 'psychology' },
      { original: 'resilience', scrambled: 'eliecnesri', hint: 'Ability to bounce back', category: 'character' },
      { original: 'meditation', scrambled: 'ittomeaidn', hint: 'Mindful practice', category: 'wellness' },
      { original: 'challenge', scrambled: 'egnelhalc', hint: 'Test of ability', category: 'concept' },
      { original: 'confidence', scrambled: 'ocfneednic', hint: 'Self-assurance', category: 'psychology' },
      { original: 'enthusiasm', scrambled: 'stiumehans', hint: 'Eager enjoyment', category: 'emotions' },
      { original: 'accomplish', scrambled: 'mccoiphals', hint: 'Achieve a goal', category: 'achievement' },
      { original: 'discipline', scrambled: 'cipsdenlii', hint: 'Self-control', category: 'character' }
    ]
  };
  
  // Load best scores from localStorage
  useEffect(() => {
    const savedBestScores = localStorage.getItem('word_game_best_scores');
    if (savedBestScores) {
      setBestScore(JSON.parse(savedBestScores));
    }
  }, []);
  
  // Save best scores to localStorage
  useEffect(() => {
    localStorage.setItem('word_game_best_scores', JSON.stringify(bestScore));
  }, [bestScore]);
  
  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [gameStarted, gameOver]);
  
  // Focus input when game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      inputRef.current?.focus();
    }
  }, [gameStarted, gameOver, currentWordIndex]);
  
  // Reset correct/incorrect animation after a delay
  useEffect(() => {
    if (isCorrect !== null) {
      const timeout = setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [isCorrect]);
  
  // Shuffle a word
  const shuffleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCurrentWordIndex(0);
    setGuess('');
    setScore(0);
    setTimeLeft(getDifficultyTime());
    setHintsUsed(0);
    setShowHint(false);
    setShowAnswer(false);
    setIsCorrect(null);
    setCorrectWords([]);
    
    // Shuffle the wordlist order
    wordLists[difficulty] = [...wordLists[difficulty]].sort(() => Math.random() - 0.5);
  };
  
  // Get time based on difficulty
  const getDifficultyTime = (): number => {
    switch (difficulty) {
      case 'easy': return 90;
      case 'medium': return 60;
      case 'hard': return 45;
      default: return 60;
    }
  };
  
  // End the game
  const endGame = () => {
    setGameOver(true);
    setResultsOpen(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Update best score if current score is higher
    if (score > bestScore[difficulty]) {
      setBestScore(prev => ({ ...prev, [difficulty]: score }));
      
      // Give reward if it's a new best score
      addReward(score, `New high score in Word Game (${difficulty})`);
    }
  };
  
  // Check the user's guess
  const checkGuess = () => {
    const currentWord = wordLists[difficulty][currentWordIndex];
    const isAnswerCorrect = guess.toLowerCase().trim() === currentWord.original.toLowerCase();
    
    if (isAnswerCorrect) {
      playSound("correct");
      setIsCorrect(true);
      
      // Calculate score based on difficulty and hint usage
      const basePoints = {
        easy: 10,
        medium: 20,
        hard: 30
      };
      
      // Reduce points if hint was used
      const pointsEarned = showHint ? Math.floor(basePoints[difficulty] * 0.5) : basePoints[difficulty];
      
      setScore(prev => prev + pointsEarned);
      setCorrectWords(prev => [...prev, currentWord.original]);
      
      // Reset for next word
      setTimeout(() => {
        if (currentWordIndex < wordLists[difficulty].length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setGuess('');
          setShowHint(false);
          setShowAnswer(false);
        } else {
          // Loop back to the beginning if we've gone through all words
          setCurrentWordIndex(0);
          setGuess('');
          setShowHint(false);
          setShowAnswer(false);
        }
      }, 1000);
    } else {
      playSound("incorrect");
      setIsCorrect(false);
      
      // Show animated answer after three wrong attempts
      setShowAnimatedAnswer(true);
      setTimeout(() => {
        setShowAnimatedAnswer(false);
      }, 2000);
    }
  };
  
  // Show hint for current word
  const useHint = () => {
    playSound("click");
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };
  
  // Skip current word
  const skipWord = () => {
    playSound("click");
    if (currentWordIndex < wordLists[difficulty].length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
    setGuess('');
    setShowHint(false);
    setShowAnswer(false);
  };
  
  // Play a sound effect
  const playSound = (type: 'click' | 'correct' | 'incorrect') => {
    if (!soundEnabled) return;
    
    // In a real implementation, these would be actual sounds
    console.log(`Playing ${type} sound`);
  };
  
  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  // Get the current word
  const getCurrentWord = (): Word => {
    return wordLists[difficulty][currentWordIndex];
  };
  
  // Get color for difficulty
  const getDifficultyColor = (diff: Difficulty): string => {
    switch (diff) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-blue-500';
      case 'hard': return 'text-red-500';
      default: return '';
    }
  };
  
  // Handle keyboard enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkGuess();
    }
  };

  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="size-5" />
              Word Scramble
            </CardTitle>
            <CardDescription>
              Unscramble words to earn points and have fun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sound Effects</label>
                <Button
                  variant="outline"
                  onClick={toggleSound}
                  className="w-full flex justify-between items-center"
                >
                  <span>{soundEnabled ? 'Enabled' : 'Disabled'}</span>
                  {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Best Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{bestScore[difficulty]}</p>
                  <p className="text-xs text-muted-foreground">
                    on <span className={getDifficultyColor(difficulty)}>{difficulty}</span> difficulty
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Time Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{getDifficultyTime()}</p>
                  <p className="text-xs text-muted-foreground">seconds</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Game explanation */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h3 className="font-medium">How to Play:</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Unscramble as many words as you can before time runs out</li>
                <li>Each correct answer earns points based on difficulty</li>
                <li>Using hints gives fewer points</li>
                <li>Skip difficult words, but use wisely!</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={startGame} 
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
              <Puzzle className="size-6" />
              Word Scramble
            </h2>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="size-4 mr-1" />
                {timeLeft}s
              </Badge>
              
              <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary">
                <Trophy className="size-4 mr-1" />
                {score}
              </Badge>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSound}
                className="h-8 w-8"
              >
                {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </Button>
            </div>
          </div>
          
          {!gameOver ? (
            <Card className={`border-2 ${isCorrect === true ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : isCorrect === false ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-primary/20'}`}>
              <CardContent className="pt-6 space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    {getCurrentWord().category}
                  </Badge>
                  <h2 className="text-4xl font-bold mb-1 tracking-wider">
                    {getCurrentWord().scrambled.split('').map((letter, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mx-1"
                        animate={showAnimatedAnswer ? {
                          y: [0, -15, 0],
                          color: ['currentColor', '#7c3aed', 'currentColor'],
                          transition: { delay: i * 0.1, duration: 0.3 }
                        } : {}}
                      >
                        {showAnimatedAnswer ? getCurrentWord().original[i] : letter}
                      </motion.span>
                    ))}
                  </h2>
                  <p className="text-muted-foreground">
                    Word {currentWordIndex + 1} of {wordLists[difficulty].length}
                  </p>
                </div>
                
                {showHint && (
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-sm"><span className="font-medium">Hint:</span> {getCurrentWord().hint}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer"
                    className="text-lg"
                    disabled={gameOver}
                  />
                  <Button onClick={checkGuess} disabled={!guess.trim() || gameOver}>
                    Check
                  </Button>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={useHint}
                    disabled={showHint || gameOver}
                  >
                    <Zap className="size-4 mr-1" />
                    Hint
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={skipWord}
                    disabled={gameOver}
                  >
                    <RefreshCw className="size-4 mr-1" />
                    Skip
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time remaining</span>
                    <span>{timeLeft}s</span>
                  </div>
                  <Progress value={(timeLeft / getDifficultyTime()) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGameStarted(false)}
                className="mx-auto block"
              >
                Return to Settings
              </Button>
            </motion.div>
          )}
        </div>
      )}
      
      {/* Game Results Dialog */}
      <AlertDialog open={resultsOpen} onOpenChange={setResultsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              Game Results
            </AlertDialogTitle>
            <AlertDialogDescription>
              You've completed the game! Here's how you did.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Final Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{score}</p>
                  {score > bestScore[difficulty] && (
                    <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                      New Record!
                    </Badge>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Words Solved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{correctWords.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Hints used: {hintsUsed}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {correctWords.length > 0 && (
              <div className="bg-muted p-4 rounded-lg max-h-40 overflow-y-auto">
                <h3 className="font-medium mb-2">Words You Solved:</h3>
                <div className="flex flex-wrap gap-2">
                  {correctWords.map((word, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/10">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 