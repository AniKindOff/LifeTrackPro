import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@shared/schema";

export default function RewardBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  const { data: notifications } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  useEffect(() => {
    // Check for unread streak notifications
    if (notifications && notifications.length > 0) {
      const streakNotifications = notifications
        .filter(n => n.type === 'streak' && !n.isRead)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (streakNotifications.length > 0) {
        setCurrentNotification(streakNotifications[0]);
        setShowBanner(true);
        
        // Auto-hide after 10 seconds
        const timer = setTimeout(() => {
          setShowBanner(false);
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  const handleClose = () => {
    setShowBanner(false);
    
    // Mark notification as read in local state
    if (currentNotification) {
      // Ideally we'd also update the API here, but we'll keep it simple for now
    }
  };

  if (!currentNotification) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg">
            <button 
              onClick={handleClose} 
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Award className="h-10 w-10 text-yellow-100" />
              </motion.div>
              
              <div>
                <h3 className="font-bold text-lg">{currentNotification.title}</h3>
                <p>{currentNotification.message}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <motion.div
                className="flex gap-2"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1.5
                }}
              >
                {/* Reward Stars Animation */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 1L12.7 6.6L19 7.6L14.5 12L15.5 18.2L10 15.3L4.5 18.2L5.5 12L1 7.6L7.3 6.6L10 1Z"
                        fill="#FFFACD"
                        stroke="#FFFACD"
                      />
                    </svg>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 