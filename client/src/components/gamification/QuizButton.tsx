import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import QuizManager from '@/components/games/QuizManager';

export default function QuizButton() {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowQuiz(true)}
        className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
      >
        <Brain className="h-5 w-5" />
        Play Financial Quiz
      </Button>

      {showQuiz && (
        <QuizManager onClose={() => setShowQuiz(false)} />
      )}
    </>
  );
} 