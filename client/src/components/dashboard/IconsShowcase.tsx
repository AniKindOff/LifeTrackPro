import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowingIcon } from "@/components/ui/GlowingIcon";
import { motion } from "framer-motion";
import type { IconType } from "@/components/ui/GlowingIcon";

const iconTypes: Array<{type: IconType; label: string; color: string}> = [
  { type: 'habit', label: 'Habit Tracker', color: '#5eead4' },
  { type: 'finance', label: 'Finance Manager', color: '#a5b4fc' },
  { type: 'streak', label: 'Streak Tracker', color: '#fcd34d' },
  { type: 'goal', label: 'Goal Setting', color: '#f9a8d4' },
  { type: 'reward', label: 'Rewards System', color: '#86efac' },
  { type: 'compass', label: 'Life Direction', color: '#93c5fd' },
  { type: 'trending', label: 'Progress Analytics', color: '#fdba74' },
  { type: 'activity', label: 'Daily Activity', color: '#c4b5fd' },
];

export default function IconsShowcase() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-center">App Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-2">
          {iconTypes.map((icon, index) => (
            <motion.div
              key={icon.type}
              className="flex flex-col items-center justify-center gap-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <GlowingIcon 
                type={icon.type} 
                size={60} 
                glowColor={icon.color} 
              />
              <span className="text-sm font-medium mt-2">{icon.label}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 