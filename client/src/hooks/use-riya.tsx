import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { RiyaContext, RiyaMessage } from '@/types/riya';
import { useUser } from '@/hooks/use-user';
import { getDailyChallenge, getDailyQuote, getShayari, getFinanceTip, getHabitAdvice } from '@/lib/riya-service';

// Default context values
const defaultContext: RiyaContext = {
  userMood: {
    current: 'neutral',
    score: 5,
    history: []
  },
  language: 'en',
  lastInteraction: new Date(),
  conversationHistory: [],
  userPreferences: {
    notifications: true,
    dailyQuotes: true,
    shayari: true,
    financialTips: true
  },
  dailyChallenge: '',
  dailyQuote: {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
    category: "Leadership & Vision"
  },
  shayari: '',
  financeTip: '',
  habitAdvice: '',
  showRewardPopup: false,
  showDailyQuote: false,
  showLevelUp: false,
  currentLevel: 1,
  coinsEarned: 100
};

interface RiyaContextType {
  showRewardPopup: boolean;
  setShowRewardPopup: (show: boolean) => void;
  showDailyQuote: boolean;
  setShowDailyQuote: (show: boolean) => void;
  showLevelUp: boolean;
  setShowLevelUp: (show: boolean) => void;
  currentLevel: number;
  coinsEarned: number;
  userMood: string;
  setUserMood: (mood: string) => void;
  recentMessages: { content: string; timestamp: Date }[];
  addMessage: (message: string) => void;
}

const defaultContextType: RiyaContextType = {
  showRewardPopup: false,
  setShowRewardPopup: () => {},
  showDailyQuote: false,
  setShowDailyQuote: () => {},
  showLevelUp: false,
  setShowLevelUp: () => {},
  currentLevel: 3,
  coinsEarned: 50,
  userMood: 'neutral',
  setUserMood: () => {},
  recentMessages: [],
  addMessage: () => {},
};

const RiyaContext = createContext<RiyaContextType>(defaultContextType);

export const RiyaProvider = ({ children }: { children: ReactNode }) => {
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [showDailyQuote, setShowDailyQuote] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [userMood, setUserMood] = useState('neutral');
  const [recentMessages, setRecentMessages] = useState<{ content: string; timestamp: Date }[]>([]);

  // Mock values
  const currentLevel = 3;
  const coinsEarned = 50;

  const addMessage = (message: string) => {
    setRecentMessages((prev) => {
      const newMessages = [...prev, { content: message, timestamp: new Date() }];
      // Only keep the last 10 messages
      if (newMessages.length > 10) {
        return newMessages.slice(newMessages.length - 10);
      }
      return newMessages;
    });
  };

  return (
    <RiyaContext.Provider
      value={{
        showRewardPopup,
        setShowRewardPopup,
        showDailyQuote,
        setShowDailyQuote,
        showLevelUp,
        setShowLevelUp,
        currentLevel,
        coinsEarned,
        userMood,
        setUserMood,
        recentMessages,
        addMessage,
      }}
    >
      {children}
    </RiyaContext.Provider>
  );
};

export const useRiya = (): RiyaContextType => {
  return useContext(RiyaContext);
}; 