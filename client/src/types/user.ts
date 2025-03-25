export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    language: 'en' | 'hi' | 'hinglish';
    notifications: boolean;
    dailyQuotes: boolean;
    shayari: boolean;
    financialTips: boolean;
  };
} 