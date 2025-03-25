import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, Trophy, Award, Sparkles, Star, Coins } from 'lucide-react';

interface LevelUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  title: string;
  coinsEarned: number;
}

export function LevelUpPopup({ isOpen, onClose, level, title, coinsEarned }: LevelUpPopupProps) {
  if (!isOpen) return null;

  // Unlock messages based on level
  const levelUnlocks = [
    "Daily Rewards Boosted!",
    "New Shop Items Available!",
    "Challenge Difficulty Increased!",
    "New Avatar Frames Unlocked!",
    "Double XP Weekends Access!",
    "Premium Themes Unlocked!",
    "Special Missions Available!",
    "Exclusive Achievements Unlocked!",
    "Master Badges Available!",
    "Mentor Status Achieved!"
  ];
  
  // Get unlocks for this level
  const unlockMessage = level <= 10 ? levelUnlocks[level - 1] : "All features unlocked!";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card max-w-md w-full rounded-lg border shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti animation */}
            <div className="relative h-32 bg-gradient-to-r from-primary/90 to-blue-600 flex justify-center items-center overflow-hidden">
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 3, repeatType: "reverse" }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white"
                    initial={{
                      x: Math.random() * 100 - 50 + "%",
                      y: -20,
                      opacity: 0,
                    }}
                    animate={{
                      y: ["0%", "120%"],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeOut",
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.div
                animate={{ 
                  rotateY: [0, 360], 
                  scale: [1, 1.2, 1] 
                }}
                transition={{ 
                  rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative z-10"
              >
                <Trophy className="h-16 w-16 text-yellow-300 drop-shadow-glow" />
              </motion.div>
            </div>
              
            <div className="p-6 text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You've reached Level {level}
                </p>
              </motion.div>
                
              {/* Rewards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 p-4 rounded-lg space-y-3"
              >
                <h3 className="text-sm font-medium flex items-center justify-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Rewards Earned
                </h3>
                  
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card rounded-md p-3 flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                    <span className="font-semibold">{coinsEarned} Coins</span>
                  </div>
                    
                  <div className="bg-card rounded-md p-3 flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span className="font-semibold">+5% XP Boost</span>
                  </div>
                </div>
                  
                <div className="bg-card rounded-md p-3 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm">{unlockMessage}</span>
                </div>
              </motion.div>
                
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button onClick={onClose} className="w-full">
                  Continue Your Journey
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 