import React from 'react';
import { motion } from 'framer-motion';
import { useRiya } from '@/hooks/use-riya';
import { Coins } from 'lucide-react';

export function RewardBalance() {
  const { coinsEarned } = useRiya();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 bg-card rounded-full px-4 py-1.5 border shadow-sm"
    >
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          repeatDelay: 5
        }}
      >
        <Coins className="h-4 w-4 text-yellow-500" />
      </motion.div>
      <span className="font-semibold text-sm">{coinsEarned}</span>
    </motion.div>
  );
} 