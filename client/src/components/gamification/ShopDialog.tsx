import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ShoppingBag, Award, Crown, Gift } from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';
import { useToast } from '@/components/ui/use-toast';

interface ShopDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'theme' | 'avatar' | 'badge' | 'powerup';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'theme1',
    name: 'Dark Theme',
    description: 'A sleek dark theme for your dashboard',
    price: 500,
    image: '🌙',
    category: 'theme',
    rarity: 'common'
  },
  {
    id: 'theme2',
    name: 'Neon Theme',
    description: 'Vibrant neon colors for your interface',
    price: 1000,
    image: '💫',
    category: 'theme',
    rarity: 'rare'
  },
  {
    id: 'avatar1',
    name: 'Golden Avatar',
    description: 'A premium golden border for your avatar',
    price: 750,
    image: '👑',
    category: 'avatar',
    rarity: 'rare'
  },
  {
    id: 'badge1',
    name: 'Productivity Master',
    description: 'Show off your productivity skills',
    price: 1500,
    image: '🏆',
    category: 'badge',
    rarity: 'epic'
  },
  {
    id: 'powerup1',
    name: 'Double Coins',
    description: 'Earn double coins for 24 hours',
    price: 2000,
    image: '⚡',
    category: 'powerup',
    rarity: 'epic'
  },
  {
    id: 'powerup2',
    name: 'Streak Saver',
    description: 'Protects one streak from breaking',
    price: 1200,
    image: '🛡️',
    category: 'powerup',
    rarity: 'rare'
  },
  {
    id: 'theme3',
    name: 'Nature Theme',
    description: 'Calming nature-inspired interface',
    price: 800,
    image: '🌿',
    category: 'theme',
    rarity: 'common'
  },
  {
    id: 'badge2',
    name: 'Focus Champion',
    description: 'Badge for exceptional focus sessions',
    price: 2500,
    image: '🧠',
    category: 'badge',
    rarity: 'legendary'
  }
];

const rarityColors = {
  common: 'bg-slate-200 text-slate-800',
  rare: 'bg-blue-200 text-blue-800',
  epic: 'bg-purple-200 text-purple-800',
  legendary: 'bg-amber-200 text-amber-800'
};

const categoryIcons = {
  theme: <Crown className="h-4 w-4" />,
  avatar: <Award className="h-4 w-4" />,
  badge: <Gift className="h-4 w-4" />,
  powerup: <ShoppingBag className="h-4 w-4" />
};

export const ShopDialog = ({ isOpen, onClose }: ShopDialogProps) => {
  const { coinsEarned, setCoinsEarned } = useRiya();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [animatingCoin, setAnimatingCoin] = useState<boolean>(false);

  // Load purchased items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('purchasedItems');
    if (savedItems) {
      setPurchasedItems(JSON.parse(savedItems));
    }
  }, []);

  // Filter items by category if one is selected
  const filteredItems = selectedCategory 
    ? SHOP_ITEMS.filter(item => item.category === selectedCategory)
    : SHOP_ITEMS;

  const playSound = (soundName: 'purchase' | 'error' | 'click') => {
    let soundPath = '';
    switch (soundName) {
      case 'purchase':
        soundPath = '/sounds/purchase.mp3';
        break;
      case 'error':
        soundPath = '/sounds/error.mp3';
        break;
      case 'click':
        soundPath = '/sounds/click.mp3';
        break;
    }
    
    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Failed to play sound'));
  };

  const purchaseItem = (item: ShopItem) => {
    if (purchasedItems.includes(item.id)) {
      toast({
        title: "Already Purchased",
        description: `You already own the ${item.name}.`,
        variant: "default"
      });
      playSound('click');
      return;
    }

    if (coinsEarned >= item.price) {
      playSound('purchase');
      setAnimatingCoin(true);
      setTimeout(() => setAnimatingCoin(false), 1000);
      
      setCoinsEarned(coinsEarned - item.price);
      
      // Add to purchased items and save to localStorage
      const newPurchasedItems = [...purchasedItems, item.id];
      setPurchasedItems(newPurchasedItems);
      localStorage.setItem('purchasedItems', JSON.stringify(newPurchasedItems));
      
      // Show success toast
      toast({
        title: "Purchase Successful!",
        description: `You've acquired the ${item.name}.`,
        variant: "default"
      });
    } else {
      playSound('error');
      // Show insufficient funds toast
      toast({
        title: "Insufficient Coins",
        description: `You need ${item.price - coinsEarned} more coins to purchase this item.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto dialog-content">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Rewards Shop
          </DialogTitle>
          <DialogDescription>
            Spend your hard-earned coins on exclusive items and upgrades.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <div className="sticky top-0 z-10 bg-background pb-4 pt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className={`h-5 w-5 text-amber-500 ${animatingCoin ? 'coin-animation' : ''}`} />
                <span className="text-lg font-bold text-amber-600">{coinsEarned} coins</span>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(null);
                }}
                className="whitespace-nowrap"
              >
                All Items
              </Button>
              {['theme', 'avatar', 'badge', 'powerup'].map(category => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => {
                    playSound('click');
                    setSelectedCategory(category);
                  }}
                  className="whitespace-nowrap flex items-center gap-1"
                >
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`shop-item relative rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm p-4 ${
                  purchasedItems.includes(item.id) ? 'border-primary border-2' : ''
                }`}
              >
                {purchasedItems.includes(item.id) && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="badge-glow">Owned</Badge>
                  </div>
                )}
                
                <div className="flex flex-col items-center mb-2">
                  <div className="text-4xl mb-2">{item.image}</div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                </div>
                
                <Badge 
                  className={`${rarityColors[item.rarity]} mb-2`}
                >
                  {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </Badge>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{item.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <Coins className="h-4 w-4 text-amber-500 mr-1" />
                    <span className="font-bold">{item.price}</span>
                  </div>
                  
                  <Button 
                    variant={coinsEarned >= item.price ? "default" : "outline"}
                    disabled={purchasedItems.includes(item.id) || coinsEarned < item.price}
                    onClick={() => purchaseItem(item)}
                    className={`${coinsEarned >= item.price && !purchasedItems.includes(item.id) ? 'btn-gradient' : ''}`}
                  >
                    {purchasedItems.includes(item.id) ? 'Owned' : 'Purchase'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 