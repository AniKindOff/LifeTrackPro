export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'theme' | 'avatar' | 'boost' | 'badge' | 'powerup';
  image: string;
  effect?: string;
  duration?: number; // in days
  unlockLevel?: number;
}

export const shopItems: ShopItem[] = [
  {
    id: 'double-xp-boost',
    name: 'Double XP Boost',
    description: 'Earn double XP for all activities for 24 hours',
    price: 500,
    category: 'boost',
    image: 'https://img.icons8.com/fluency/96/rocket.png',
    effect: 'double_xp',
    duration: 1
  },
  {
    id: 'streak-shield',
    name: 'Streak Shield',
    description: 'Protect your streak for one missed day',
    price: 300,
    category: 'powerup',
    image: 'https://img.icons8.com/fluency/96/shield.png',
    effect: 'streak_protection'
  },
  {
    id: 'golden-theme',
    name: 'Golden Theme',
    description: 'Unlock an exclusive golden theme for your profile',
    price: 1000,
    category: 'theme',
    image: 'https://img.icons8.com/fluency/96/paint-palette.png',
    unlockLevel: 5
  },
  {
    id: 'pro-badge',
    name: 'Pro Badge',
    description: 'Show off your dedication with a special badge',
    price: 750,
    category: 'badge',
    image: 'https://img.icons8.com/fluency/96/medal.png',
    unlockLevel: 3
  },
  {
    id: 'ninja-avatar',
    name: 'Ninja Avatar',
    description: 'Exclusive ninja-themed avatar frame',
    price: 600,
    category: 'avatar',
    image: 'https://img.icons8.com/fluency/96/user-male-circle.png',
    unlockLevel: 2
  },
  {
    id: 'coin-multiplier',
    name: 'Coin Multiplier',
    description: 'Earn 1.5x coins for 3 days',
    price: 800,
    category: 'boost',
    image: 'https://img.icons8.com/fluency/96/coins.png',
    effect: 'coin_boost',
    duration: 3
  },
  {
    id: 'mystery-box',
    name: 'Mystery Box',
    description: 'Contains a random reward worth 200-1000 coins',
    price: 400,
    category: 'powerup',
    image: 'https://img.icons8.com/fluency/96/gift.png'
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme Pro',
    description: 'Enhanced dark theme with custom accents',
    price: 500,
    category: 'theme',
    image: 'https://img.icons8.com/fluency/96/moon-symbol.png'
  }
]; 