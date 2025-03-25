import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useRewards } from "@/hooks/use-rewards";

export default function RewardBalance() {
  const { balance, withdrawalThreshold } = useRewards();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <Button
        variant="outline"
        size="sm"
        className="relative group"
      >
        <Wallet className="h-4 w-4 mr-2" />
        <span>₹{balance}</span>
        {balance >= withdrawalThreshold && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            !
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
} 