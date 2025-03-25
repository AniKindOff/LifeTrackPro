import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Activity, 
  DollarSign, 
  Calendar, 
  Award, 
  Zap,
  Compass,
  Target,
  TrendingUp 
} from 'lucide-react';

export type IconType = 
  | 'habit' 
  | 'finance' 
  | 'streak' 
  | 'goal' 
  | 'reward' 
  | 'activity'
  | 'compass'
  | 'target'
  | 'trending';

interface GlowingIconProps {
  type: IconType;
  size?: number;
  color?: string;
  glowColor?: string;
  className?: string;
  animate?: boolean;
}

export function GlowingIcon({ 
  type, 
  size = 40, 
  color = '#ffffff', 
  glowColor = '#5eead4',
  className = '',
  animate = true
}: GlowingIconProps) {
  const iconMap: Record<IconType, JSX.Element> = {
    habit: <Activity size={size * 0.5} />,
    finance: <DollarSign size={size * 0.5} />,
    streak: <Zap size={size * 0.5} />,
    goal: <Target size={size * 0.5} />,
    reward: <Award size={size * 0.5} />,
    activity: <Calendar size={size * 0.5} />,
    compass: <Compass size={size * 0.5} />,
    trending: <TrendingUp size={size * 0.5} />,
    target: <Target size={size * 0.5} />,
  };

  const IconComponent = iconMap[type] || iconMap.activity;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer glow circle */}
      <motion.div
        className="absolute rounded-full"
        style={{ 
          width: size, 
          height: size,
          backgroundColor: glowColor,
          filter: `blur(${size * 0.2}px)`,
          opacity: 0.4
        }}
        animate={animate ? { 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4] 
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner circle */}
      <div 
        className="absolute rounded-full flex items-center justify-center"
        style={{ 
          width: size * 0.9, 
          height: size * 0.9,
          backgroundColor: glowColor,
          boxShadow: `0 0 ${size * 0.1}px ${glowColor}`,
        }}
      />
      
      {/* Main circle with icon */}
      <div 
        className="z-10 rounded-full flex items-center justify-center"
        style={{ 
          width: size * 0.8, 
          height: size * 0.8,
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: color,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: color,
          boxShadow: `inset 0 0 ${size * 0.05}px ${glowColor}`,
        }}
      >
        {IconComponent}
      </div>
      
      {/* Small decoration dots */}
      {[45, 135, 225, 315].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.06,
            height: size * 0.06,
            left: `${50 + 46 * Math.cos(angle * Math.PI / 180)}%`,
            top: `${50 + 46 * Math.sin(angle * Math.PI / 180)}%`,
            boxShadow: `0 0 ${size * 0.03}px ${glowColor}`,
          }}
          animate={animate ? { 
            scale: [1, 1.3, 1],
          } : undefined}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Arc segments */}
      {[0, 90, 180, 270].map((angle, i) => (
        <div
          key={`arc-${i}`}
          className="absolute"
          style={{
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: '50%',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'transparent',
            borderTopColor: color,
            transform: `rotate(${angle}deg)`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
} 