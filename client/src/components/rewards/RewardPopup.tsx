import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Gift, Wallet } from "lucide-react";

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  dailyReward: number;
  withdrawalThreshold: number;
  onWithdraw: () => void;
}

export default function RewardPopup({
  isOpen,
  onClose,
  currentBalance,
  dailyReward,
  withdrawalThreshold,
  onWithdraw,
}: RewardPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="w-[90vw] max-w-md p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary/10 p-4 rounded-full"
                >
                  <Gift className="h-12 w-12 text-primary" />
                </motion.div>

                <h2 className="text-2xl font-bold">Daily Reward!</h2>
                <p className="text-muted-foreground">
                  You've earned ₹{dailyReward} for logging in today
                </p>

                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Current Balance:</span>
                    <span className="font-semibold">₹{currentBalance}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Withdrawal Threshold:</span>
                    <span className="font-semibold">₹{withdrawalThreshold}</span>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <Button
                    className="w-full"
                    onClick={onWithdraw}
                    disabled={currentBalance < withdrawalThreshold}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Withdraw Balance
                  </Button>
                </div>

                {currentBalance < withdrawalThreshold && (
                  <p className="text-sm text-muted-foreground">
                    You need ₹{withdrawalThreshold - currentBalance} more to withdraw
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 