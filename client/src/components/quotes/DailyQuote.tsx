import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Quote } from "lucide-react";
import { playSound } from "@/lib/sound-manager";

interface DailyQuoteProps {
  isOpen: boolean;
  onClose: () => void;
}

const quotes = [
  {
    hindi: "पैसा कमाना मुश्किल है, बचाना उससे भी मुश्किल।",
    english: "Earning money is difficult, saving it is even more difficult.",
    category: "finance",
  },
  {
    hindi: "छोटी-छोटी बचत, बड़ी समृद्धि की ओर ले जाती है।",
    english: "Small savings lead to great prosperity.",
    category: "budget",
  },
  {
    hindi: "अच्छी आदतें सफलता की नींव हैं।",
    english: "Good habits are the foundation of success.",
    category: "habit",
  },
  {
    hindi: "हर दिन एक नई शुरुआत है।",
    english: "Every day is a new beginning.",
    category: "motivation",
  },
  {
    hindi: "समय और पैसा दोनों का सदुपयोग करें।",
    english: "Make good use of both time and money.",
    category: "finance",
  },
  {
    hindi: "नियमितता सफलता की कुंजी है।",
    english: "Regularity is the key to success.",
    category: "habit",
  },
  {
    hindi: "बजट बनाएं, समृद्धि पाएं।",
    english: "Make a budget, achieve prosperity.",
    category: "budget",
  },
  {
    hindi: "कल करे सो आज कर, आज करे सो अब।",
    english: "Do tomorrow's work today, do today's work now.",
    category: "motivation",
  },
];

export default function DailyQuote({ isOpen, onClose }: DailyQuoteProps) {
  // Get a random quote based on the day
  const getDailyQuote = () => {
    const today = new Date();
    const index = today.getDate() % quotes.length;
    return quotes[index];
  };

  const quote = getDailyQuote();

  // Play sound when quote opens
  useEffect(() => {
    if (isOpen) {
      playSound('success');
    }
  }, [isOpen]);

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

              <div className="flex flex-col items-center text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary/10 p-4 rounded-full"
                >
                  <Quote className="h-12 w-12 text-primary" />
                </motion.div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">आज का विचार</h2>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">{quote.hindi}</p>
                    <p className="text-sm text-muted-foreground">{quote.english}</p>
                  </div>
                  <p className="text-xs text-primary uppercase tracking-wider">
                    #{quote.category}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 