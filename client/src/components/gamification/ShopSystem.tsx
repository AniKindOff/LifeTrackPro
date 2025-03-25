import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShopItem } from '@/lib/gamification/shop-items';
import { Coins, Lock, ShoppingBag, Tag, Star, Clock, Sparkles } from 'lucide-react';

interface ShopSystemProps {
  items: ShopItem[];
  userCoins: number;
  userLevel: number;
  onPurchase: (item: ShopItem) => void;
}

export function ShopSystem({ items, userCoins, userLevel, onPurchase }: ShopSystemProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Get unique categories from items
  const categories = ['all', ...new Set(items.map(item => item.category))];
  
  // Filter items by category
  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-2">
            <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="text-xl font-bold">{userCoins} Coins</p>
          </div>
        </div>
        
        <Badge variant="outline" className="px-3 py-1">
          Level {userLevel}
        </Badge>
      </div>
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isLocked = (item.unlockLevel || 1) > userLevel;
              const canAfford = userCoins >= item.price;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`overflow-hidden ${isLocked ? 'opacity-70' : ''}`}>
                    {item.image && (
                      <div 
                        className="h-40 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                    
                    {!item.image && (
                      <div className="h-40 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-primary/60" />
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant={item.category === 'powerup' ? 'destructive' : 'secondary'}>
                          {item.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-3 pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {item.duration || 'Permanent'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-yellow-500" />
                          <span className="text-xs">Lvl {item.unlockLevel}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      {isLocked ? (
                        <Button variant="outline" className="w-full" disabled>
                          <Lock className="h-4 w-4 mr-2" />
                          Unlock at Level {item.unlockLevel}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => onPurchase(item)} 
                          disabled={!canAfford}
                          className="w-full gap-2"
                          variant={canAfford ? "default" : "outline"}
                        >
                          {!canAfford && <Lock className="h-4 w-4" />}
                          {canAfford && <ShoppingBag className="h-4 w-4" />}
                          <span>{canAfford ? 'Purchase' : 'Not Enough Coins'}</span>
                          <div className="flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-yellow-300" />
                            <span>{item.price}</span>
                          </div>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mt-1">
                No items available in this category
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 