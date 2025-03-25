import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Trophy, Star } from 'lucide-react';
import { questions } from '@/lib/gamification/quiz-questions';
import FinancialQuiz from './FinancialQuiz';
import { useGamification } from '@/hooks/useGamification';
import { useLanguage } from '@/hooks/useLanguage';

interface QuizManagerProps {
  onClose: () => void;
}

export default function QuizManager({ onClose }: QuizManagerProps) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { addXP, addCoins } = useGamification();
  const { language } = useLanguage();

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);
    setQuizCompleted(true);

    // Convert quiz points to XP and coins
    const xpEarned = Math.floor(score * 1.5);
    const coinsEarned = Math.floor(score * 0.5);

    // Award XP and coins
    addXP(xpEarned);
    addCoins(coinsEarned);
  };

  const startNewQuiz = () => {
    setQuizCompleted(false);
    setFinalScore(0);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6">
        {!quizCompleted ? (
          <FinancialQuiz
            onComplete={handleQuizComplete}
            language={language}
          />
        ) : (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">XP Earned</p>
                <p className="text-2xl font-bold">{Math.floor(finalScore * 1.5)}</p>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Coins Earned</p>
                <p className="text-2xl font-bold">{Math.floor(finalScore * 0.5)}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={startNewQuiz}>
                Try Another Quiz
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 