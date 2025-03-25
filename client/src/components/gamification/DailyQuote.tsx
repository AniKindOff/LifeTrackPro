import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Quote, Share2, Bookmark, HeartHandshake } from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';

interface DailyQuoteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyQuote({ isOpen, onClose }: DailyQuoteProps) {
  const { dailyQuote } = useRiya();

  if (!isOpen || !dailyQuote) return null;

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
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="relative overflow-hidden border shadow-lg">
              {/* Decorative elements */}
              <motion.div
                className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative p-6 z-10">
                {/* Close button */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-2 top-2 hover:bg-muted/80" 
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Quote content */}
                <CardContent className="p-0 pt-4 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <Quote className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.blockquote 
                          className="text-xl font-medium leading-relaxed"
                          animate={{ scale: [1, 1.01, 1] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                          }}
                        >
                          "{dailyQuote.text}"
                        </motion.blockquote>
                        
                        <footer className="mt-3 flex justify-between items-end">
                          <div>
                            <p className="font-semibold">— {dailyQuote.author}</p>
                            {dailyQuote.category && (
                              <p className="text-xs text-muted-foreground">
                                {dailyQuote.category}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full hover:bg-primary/10"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 rounded-full hover:bg-primary/10"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </footer>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-muted/50 p-3 rounded-lg flex items-center gap-3"
                      >
                        <HeartHandshake className="h-5 w-5 text-primary" />
                        <p className="text-sm">This quote was selected to inspire your financial journey today.</p>
                      </motion.div>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button onClick={onClose} className="w-full">
                      Apply This Wisdom
                    </Button>
                  </motion.div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 