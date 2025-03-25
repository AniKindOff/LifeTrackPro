import React, { useState, useEffect } from 'react';
import { MiniGame as MiniGameType } from '../types/gamification';

interface MiniGameProps {
  game: MiniGameType;
  onComplete: (score: number) => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ game, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(game.timeLimit || 60);
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(game.timeLimit || 60);
    setScore(0);
    setGameOver(false);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    onComplete(score);
  };

  const handleClick = () => {
    if (isPlaying) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{game.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{game.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Time: {timeLeft}s</span>
          <span className="text-lg font-semibold">Score: {score}</span>
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <button
          onClick={startGame}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Game
        </button>
      )}

      {isPlaying && (
        <div
          onClick={handleClick}
          className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer flex items-center justify-center"
        >
          <span className="text-xl font-bold">Click Me!</span>
        </div>
      )}

      {gameOver && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Game Over!</h3>
          <p className="text-lg mb-4">Final Score: {score}</p>
          <button
            onClick={startGame}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {game.isPremium && (
        <div className="mt-4 text-center">
          <span className="text-yellow-500 text-sm">Premium Game</span>
        </div>
      )}
    </div>
  );
};

export default MiniGame; 