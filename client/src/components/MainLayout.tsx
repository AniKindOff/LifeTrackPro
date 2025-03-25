import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Volume2, VolumeX, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronRight, Bell, Settings, User, Home, Calendar, LineChart, Heart, GitBranch, Target, PiggyBank, MessageSquare, Gamepad2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from '@/components/Sidebar';
import DailyQuote from '@/components/quotes/DailyQuote';
import { useSound } from '@/hooks/use-sound';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // State for animated background
  const [showAnimatedBackground, setShowAnimatedBackground] = useLocalStorage('animated_background', true);
  
  // Sound management
  const { playSound, soundEnabled, setSoundEnabled } = useSound();
  
  const { theme, setTheme } = useTheme();
  
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showQuote, setShowQuote] = React.useState(false);
  const { pathname } = useLocation();
  
  // Toggle sound effects
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) playSound('click');
  };
  
  // Toggle animated background
  const toggleAnimatedBackground = () => {
    setShowAnimatedBackground(!showAnimatedBackground);
    if (soundEnabled) playSound('click');
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    if (soundEnabled) playSound('click');
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    if (soundEnabled) playSound('click');
    setShowSidebar(!showSidebar);
  };
  
  // Toggle quote visibility
  const toggleQuote = () => {
    if (soundEnabled) playSound('click');
    setShowQuote(!showQuote);
  };
  
  // Close quote popup
  const closeQuote = () => {
    if (soundEnabled) playSound('click');
    setShowQuote(false);
  };
  
  // Add click sound effect to all buttons
  useEffect(() => {
    if (!soundEnabled) return;
    
    const addClickSoundToButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        // Add click event if not already added
        if (!button.hasAttribute('data-sound-added')) {
          button.setAttribute('data-sound-added', 'true');
          button.addEventListener('click', () => playSound('click'));
        }
      });
    };
    
    // Initial addition and then on DOM changes
    addClickSoundToButtons();
    
    // Create a mutation observer to watch for new buttons
    const observer = new MutationObserver(addClickSoundToButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [soundEnabled]);
  
  // Render animated background
  const renderAnimatedBackground = () => {
    if (!showAnimatedBackground) return null;
    
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/80 backdrop-blur-3xl"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.3)_100%)]"></div>
        
        {/* Animated circles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10 dark:bg-primary/5"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() + 0.5, 1],
              opacity: [0.1, Math.random() * 0.5 + 0.1, 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
        
        {/* Neon lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent dark:via-primary/50 shadow-glow"
            style={{
              width: `${Math.random() * 40 + 20}%`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 180}deg)`,
              boxShadow: '0 0 10px 1px var(--primary)',
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              width: [`${Math.random() * 40 + 20}%`, `${Math.random() * 60 + 30}%`, `${Math.random() * 40 + 20}%`]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
        
        {/* Neon glow points */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`glow-${i}`}
            className="absolute rounded-full bg-primary/80 dark:bg-primary"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 15px 5px var(--primary)',
              filter: 'blur(1px)'
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen relative">
      {/* Animated background */}
      {renderAnimatedBackground()}
      
      {/* Controls for background and sound */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm border-border/50 shadow-md"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/80 backdrop-blur-sm border-border/50 shadow-md"
          onClick={toggleAnimatedBackground}
          title={showAnimatedBackground ? 'Disable Animated Background' : 'Enable Animated Background'}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="rounded-full h-10 w-10 bg-background/80 backdrop-blur-sm shadow-md"
          title={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Main content */}
      {children}
    </div>
  );
} 