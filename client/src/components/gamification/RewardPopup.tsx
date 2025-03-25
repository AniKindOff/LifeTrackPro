import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Gift, Award, Star, X, Check } from 'lucide-react';

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: {
    title: string;
    description: string;
    coins: number;
    xp?: number;
    items?: string[];
  };
}

export function RewardPopup({ isOpen, onClose, reward }: RewardPopupProps) {
  if (!isOpen || !reward) return null;

  const hasItems = reward.items && reward.items.length > 0;
  const hasXp = reward.xp && reward.xp > 0;

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
            className="max-w-sm w-full bg-card rounded-lg border shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gift animation */}
            <div className="relative h-28 bg-gradient-to-r from-yellow-500/90 to-orange-500 flex justify-center items-center overflow-hidden">
              <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0], 
                    rotateZ: [0, -5, 0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="relative"
                >
                  <Gift className="h-16 w-16 text-white drop-shadow-glow" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ 
                      opacity: [0, 0.7, 0] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    <Gift className="h-16 w-16 text-yellow-100" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Floating stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [
                      Math.random() * 100 - 50,
                      Math.random() * 100 - 50
                    ],
                    y: [
                      Math.random() * 100 - 50,
                      Math.random() * 100 - 50
                    ]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                >
                  <Star 
                    className="h-3 w-3 text-yellow-100" 
                    fill="rgba(255,255,255,0.7)" 
                  />
                </motion.div>
              ))}
              
              {/* Close button */}
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 text-white/80 hover:text-white hover:bg-white/10" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-5 text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold">
                  {reward.title || "Daily Reward"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {reward.description || "You've earned a reward!"}
                </p>
              </motion.div>
              
              {/* Reward items */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3 flex items-center justify-center gap-2 border-yellow-400/50">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                    <span className="font-semibold">{reward.coins} Coins</span>
                  </Card>
                  
                  {hasXp && (
                    <Card className="p-3 flex items-center justify-center gap-2 border-blue-400/50">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Award className="h-5 w-5 text-blue-500" />
                      </motion.div>
                      <span className="font-semibold">{reward.xp} XP</span>
                    </Card>
                  )}
                </div>
                
                {hasItems && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Items Received:</h3>
                    <div className="space-y-2">
                      {reward.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                          className="bg-muted/50 rounded-md p-2 flex items-center gap-2"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button onClick={onClose} className="w-full">
                  Claim Reward
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 