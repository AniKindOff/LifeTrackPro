export interface RiyaMessage {
  id: string;
  content: string;
  sender: 'user' | 'riya';
  timestamp: Date;
  language: 'en' | 'hi' | 'hinglish';
}

export interface RiyaContext {
  userMood: {
    current: string;
    score: number;
    history: Array<{
      mood: string;
      score: number;
      timestamp: Date;
    }>;
  };
  language: 'en' | 'hi' | 'hinglish';
  lastInteraction: Date;
  conversationHistory: RiyaMessage[];
  userPreferences: {
    notifications: boolean;
    dailyQuotes: boolean;
    shayari: boolean;
    financialTips: boolean;
  };
  dailyChallenge: string;
  dailyQuote: {
    text: string;
    author: string;
    category?: string;
  };
  shayari: string;
  financeTip: string;
  habitAdvice: string;
  showRewardPopup: boolean;
  showDailyQuote: boolean;
  showLevelUp: boolean;
  currentLevel: number;
  coinsEarned: number;
}

export type MoodType = 'positive' | 'negative' | 'neutral';

export interface MoodSuggestion {
  positive: {
    en: string;
    hi: string;
  };
  negative: {
    en: string;
    hi: string;
  };
  neutral: {
    en: string;
    hi: string;
  };
} 