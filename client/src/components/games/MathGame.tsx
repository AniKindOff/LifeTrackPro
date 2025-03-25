import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, Trophy, ArrowRight, Calculator, Check, X } from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';
import { useSound } from '@/hooks/use-sound';

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

interface Question {
  id: number;
  question: string;
  answer: number;
  userAnswer: string;
  isCorrect: boolean | null;
}

interface MathGameProps {
  onBack?: () => void;
}

export function MathGame({ onBack }: MathGameProps = {}) {
  const { addCoins } = useRiya();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [operation, setOperation] = useState<Operation>('mixed');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0
  });
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sound management
  const { playSound: playSoundEffect, playMusic, stopMusic, pauseMusic, resumeMusic, soundEnabled } = useSound();
  
  // Load best scores from localStorage
  useEffect(() => {
    const savedBestScores = localStorage.getItem('math_game_best_scores');
    if (savedBestScores) {
      setBestScore(JSON.parse(savedBestScores));
    }
  }, []);
  
  // Start background music when the component mounts and stop it when unmounting
  useEffect(() => {
    return () => {
      // Clean up by stopping the background music when component unmounts
      stopMusic();
    };
  }, [stopMusic]);

  // Handle visibility change to pause/resume background music
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseMusic();
      } else {
        if (gameStarted && !gameOver) {
          resumeMusic();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gameStarted, gameOver, pauseMusic, resumeMusic]);
  
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
  }, [gameStarted, gameOver, currentQuestionIndex]);
  
  const generateQuestions = (count: number): Question[] => {
    const newQuestions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      const newQuestion = generateQuestion();
      newQuestions.push(newQuestion);
    }
    
    return newQuestions;
  };
  
  const generateQuestion = (): Question => {
    let num1: number, num2: number, answer: number, questionText: string;
    let op: Operation = operation;
    
    // If mixed operation, randomly select one
    if (operation === 'mixed') {
      const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
      op = operations[Math.floor(Math.random() * operations.length)] as Operation;
    }
    
    // Generate numbers based on difficulty
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1; // 1-10
        num2 = Math.floor(Math.random() * 10) + 1; // 1-10
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 20) + 1; // 1-20
        num2 = Math.floor(Math.random() * 15) + 1; // 1-15
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 50) + 10; // 10-59
        num2 = Math.floor(Math.random() * 15) + 5; // 5-19
        break;
      case 'expert':
        num1 = Math.floor(Math.random() * 100) + 20; // 20-119
        num2 = Math.floor(Math.random() * 30) + 10; // 10-39
        break;
      default:
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    }
    
    // For division, ensure clean division
    if (op === 'division') {
      // Generate a product first, then divide
      num2 = Math.floor(Math.random() * 10) + 1; // divisor
      answer = Math.floor(Math.random() * 10) + 1; // quotient
      num1 = num2 * answer; // dividend
      questionText = `${num1} ÷ ${num2} = ?`;
    } else {
      // Generate operation and calculate answer
      switch (op) {
        case 'addition':
          answer = num1 + num2;
          questionText = `${num1} + ${num2} = ?`;
          break;
        case 'subtraction':
          // Ensure num1 > num2 to avoid negative results
          if (num1 < num2) {
            [num1, num2] = [num2, num1];
          }
          answer = num1 - num2;
          questionText = `${num1} - ${num2} = ?`;
          break;
        case 'multiplication':
          answer = num1 * num2;
          questionText = `${num1} × ${num2} = ?`;
          break;
        default:
          answer = num1 + num2;
          questionText = `${num1} + ${num2} = ?`;
      }
    }
    
    return {
      id: Date.now() + Math.random(),
      question: questionText,
      answer: answer,
      userAnswer: '',
      isCorrect: null
    };
  };
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setShowResult(false);
    
    // Generate questions and update state
    const newQuestions = generateQuestions(10);
    setQuestions(newQuestions);
    
    setCurrentQuestionIndex(0);
    setAnswer('');
    
    // Start background music
    playMusic('gameMusic', 0.3, true);
    
    // Play game start sound
    playSoundEffect('gameStart');
    
    // Start the timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Focus the input element
    if (inputRef.current) inputRef.current.focus();
  };
  
  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameOver(true);
    
    // Stop background music
    stopMusic();
    
    // Calculate the number of correct answers
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    
    // Update best score if needed
    const newBestScore = { ...bestScore };
    if (score > bestScore[difficulty]) {
      newBestScore[difficulty] = score;
      setBestScore(newBestScore);
      localStorage.setItem('math_game_best_scores', JSON.stringify(newBestScore));
    }
    
    // Award coins based on performance
    if (correctAnswers > 0) {
      const coinsEarned = Math.round(correctAnswers * 5 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : difficulty === 'hard' ? 2 : 3));
      addCoins(coinsEarned);
      
      // Play appropriate end game sound
      if (correctAnswers >= 8) {
        playSoundEffect('gameWin');
      } else {
        playSoundEffect('success');
      }
    } else {
      // Play game lose sound
      playSoundEffect('gameLose');
    }
  };
  
  const handleAnswerSubmit = () => {
    if (!answer.trim() || isNaN(Number(answer))) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = Number(answer) === currentQuestion.answer;
    
    // Update questions array with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect
    };
    
    setQuestions(updatedQuestions);
    
    // Update score and streak
    if (isCorrect) {
      const difficultyMultiplier = 
        difficulty === 'easy' ? 1 :
        difficulty === 'medium' ? 2 :
        difficulty === 'hard' ? 3 : 5;
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Bonus points for keeping a streak
      const streakBonus = newStreak >= 5 ? 2 : newStreak >= 3 ? 1.5 : 1;
      
      const points = Math.round(10 * difficultyMultiplier * streakBonus);
      setScore(prev => prev + points);
      
      // Play correct sound
      playSoundEffect('correct');
    } else {
      setStreak(0);
      
      // Play wrong sound
      playSoundEffect('wrong');
    }
    
    // Clear the answer and move to the next question
    setAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
    
    // Focus the input again
    if (inputRef.current) inputRef.current.focus();
  };
  
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-blue-500';
      case 'hard':
        return 'text-orange-500';
      case 'expert':
        return 'text-red-500';
      default:
        return '';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  };
  
  return (
    <div className="space-y-6">
      {!gameStarted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="size-5" />
              Mental Math Trainer
            </CardTitle>
            <CardDescription>
              Improve your mental math skills with quick calculations under time pressure
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
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Operation</label>
                <Select 
                  value={operation} 
                  onValueChange={(value) => setOperation(value as Operation)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="addition">Addition</SelectItem>
                    <SelectItem value="subtraction">Subtraction</SelectItem>
                    <SelectItem value="multiplication">Multiplication</SelectItem>
                    <SelectItem value="division">Division</SelectItem>
                  </SelectContent>
                </Select>
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
                    on {difficulty} difficulty
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Time Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">60</p>
                  <p className="text-xs text-muted-foreground">seconds</p>
                </CardContent>
              </Card>
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="size-6" />
              Mental Math Trainer
            </h1>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="size-4 mr-1" />
                {timeLeft}s
              </Badge>
              
              <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary">
                <Trophy className="size-4 mr-1" />
                {score}
              </Badge>
              
              <Badge variant="outline" className="px-3 py-1">
                Streak: {streak}
              </Badge>
            </div>
          </div>
          
          {!gameOver ? (
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-1">
                    {questions[currentQuestionIndex]?.question}
                  </h2>
                  <p className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="number"
                    placeholder="Enter your answer"
                    className="text-lg"
                  />
                  <Button onClick={handleAnswerSubmit} disabled={!answer.trim()}>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time remaining</span>
                    <span>{timeLeft}s</span>
                  </div>
                  <Progress value={(timeLeft / 60) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Game Over!</CardTitle>
                <CardDescription>
                  You scored {score} points on {difficulty} difficulty
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {showResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Card className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Total Score</CardTitle>
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
                          <CardTitle className="text-base">Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold">
                            {questions.filter(q => q.isCorrect).length}/{questions.filter(q => q.isCorrect !== null).length}
                          </p>
                          <p className="text-xs text-muted-foreground">correct answers</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2">
                      <h3 className="font-medium mb-2">Questions Recap</h3>
                      
                      {questions.filter(q => q.isCorrect !== null).slice(0, 15).map((q, index) => (
                        <div 
                          key={q.id} 
                          className={`flex items-center justify-between p-2 rounded-md ${
                            q.isCorrect 
                              ? 'bg-green-100 dark:bg-green-900/20' 
                              : 'bg-red-100 dark:bg-red-900/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">{index + 1}.</span>
                            <span>
                              {q.question.replace('?', '')} {q.answer}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className={q.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {q.userAnswer}
                            </span>
                            {q.isCorrect ? (
                              <Check className="size-4 text-green-600" />
                            ) : (
                              <X className="size-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button 
                  onClick={() => startGame()} 
                  className="flex-1"
                >
                  Play Again
                </Button>
                <Button 
                  onClick={() => setGameStarted(false)} 
                  variant="outline"
                  className="flex-1"
                >
                  Change Settings
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!gameOver && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGameStarted(false)}
              >
                Exit Game
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
} 