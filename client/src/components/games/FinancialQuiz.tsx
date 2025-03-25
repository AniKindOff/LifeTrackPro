import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle2, XCircle, Trophy, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: {
    en: string;
    hi: string;
  };
  options: {
    en: string[];
    hi: string[];
  };
  correctAnswer: number;
  explanation: {
    en: string;
    hi: string;
  };
  category: 'basic' | 'intermediate' | 'advanced';
  points: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: {
      en: "What is the first step in creating a budget?",
      hi: "बजट बनाने का पहला कदम क्या है?"
    },
    options: {
      en: [
        "Track your expenses",
        "Set financial goals",
        "Calculate your income",
        "Start saving money"
      ],
      hi: [
        "खर्चों को ट्रैक करें",
        "वित्तीय लक्ष्य तय करें",
        "आय की गणना करें",
        "पैसे बचाना शुरू करें"
      ]
    },
    correctAnswer: 2,
    explanation: {
      en: "Knowing your income is essential to create a realistic budget.",
      hi: "एक यथार्थवादी बजट बनाने के लिए अपनी आय जानना आवश्यक है।"
    },
    category: 'basic',
    points: 50
  },
  // Add more questions here
];

interface FinancialQuizProps {
  onComplete: (score: number) => void;
  language: 'en' | 'hi';
}

export default function FinancialQuiz({ onComplete, language }: FinancialQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const correct = optionIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore(prev => prev + questions[currentQuestion].points);
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.7 }
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(score);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Financial Quiz</h2>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
        </div>

        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="h-2"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {questions[currentQuestion].question[language]}
          </h3>

          <div className="grid gap-3">
            {questions[currentQuestion].options[language].map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
              >
                <Button
                  variant={
                    selectedAnswer === null
                      ? "outline"
                      : index === questions[currentQuestion].correctAnswer
                      ? "default"
                      : selectedAnswer === index
                      ? "destructive"
                      : "outline"
                  }
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => selectedAnswer === null && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="flex items-center gap-3">
                    {selectedAnswer !== null && (
                      index === questions[currentQuestion].correctAnswer ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        selectedAnswer === index && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )
                      )
                    )}
                    <span>{option}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4"
              >
                <Card className={`p-4 ${
                  isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <p className="text-sm">
                    {questions[currentQuestion].explanation[language]}
                  </p>
                </Card>

                <div className="mt-4 flex justify-end">
                  <Button onClick={nextQuestion}>
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
} 