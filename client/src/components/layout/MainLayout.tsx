import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RewardBalance } from "@/components/gamification/RewardBalance";
import { RewardPopup } from "@/components/gamification/RewardPopup";
import { DailyQuote } from "@/components/gamification/DailyQuote";
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage';
import { CalendarPage } from '@/components/calendar/CalendarPage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { ProfilePage } from '@/components/profile/ProfilePage';
import { GoalsPage } from '@/components/goals/GoalsPage';
import { useUser } from "@/hooks/use-user";
import { useRiya } from "@/hooks/use-riya";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  Compass,
  Home,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
  Store,
  BarChart2,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShopDialog } from "@/components/gamification/ShopDialog";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { RiyaChat } from "@/components/chat/RiyaChat";

export default function MainLayout() {
  const { user } = useUser();
  const {
    showRewardPopup,
    setShowRewardPopup,
    showDailyQuote,
    setShowDailyQuote,
    showLevelUp,
    setShowLevelUp,
    currentLevel,
    coinsEarned
  } = useRiya();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');

  useEffect(() => {
    // Check if theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Add small delay for smooth page entry animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const toggleTheme = () => {
    const newThemeState = !isDarkMode;
    setIsDarkMode(newThemeState);
    
    if (newThemeState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to LifeTrackPro</h1>
          <p className="text-muted-foreground mb-8">Please sign in to continue</p>
          <Button size="lg">Sign In</Button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { icon: Home, label: 'Dashboard', active: activeRoute === 'dashboard', onClick: () => setActiveRoute('dashboard') },
    { icon: CalendarDays, label: 'Calendar', active: activeRoute === 'calendar', onClick: () => setActiveRoute('calendar') },
    { icon: BarChart2, label: 'Analytics', active: activeRoute === 'analytics', onClick: () => setActiveRoute('analytics') },
    { icon: Target, label: 'Goals', active: activeRoute === 'goals', onClick: () => setActiveRoute('goals') },
    { icon: User, label: 'Profile', active: activeRoute === 'profile', onClick: () => setActiveRoute('profile') },
    { icon: Settings, label: 'Settings', active: activeRoute === 'settings', onClick: () => setActiveRoute('settings') },
    { icon: Store, label: 'Shop', active: shopOpen, onClick: () => setShopOpen(true) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center gap-2">
                    <Compass className="h-6 w-6" />
                    <h2 className="text-lg font-semibold">LifeTrackPro</h2>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item, index) => (
                      <Button
                        key={index}
                        variant={item.active ? "default" : "ghost"}
                        className="justify-start"
                        onClick={item.onClick}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Compass className="h-6 w-6 hidden md:block" />
            <h1 className="text-lg font-bold hidden md:block">LifeTrackPro</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="transition-all duration-200"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShopOpen(true)}
            >
              <Store className="h-5 w-5" />
            </Button>
            <RewardBalance />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-4">
        <div className="container flex">
          {/* Sidebar - desktop only */}
          <aside className="hidden md:flex w-64 mr-8 shrink-0">
            <nav className="flex flex-col gap-2 w-full pt-2">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "default" : "ghost"}
                  className="justify-start w-full"
                  onClick={item.onClick}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Dynamic Content */}
          <motion.div
            key={activeRoute}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 pb-12"
          >
            {activeRoute === 'analytics' && <AnalyticsPage />}
            {activeRoute === 'calendar' && <CalendarPage />}
            {activeRoute === 'settings' && <SettingsPage />}
            {activeRoute === 'goals' && <GoalsPage />}
            {activeRoute === 'profile' && <ProfilePage />}
            {activeRoute === 'dashboard' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6">Welcome back, {user?.name || 'User'}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-2">Task Progress</h3>
                      <p className="text-4xl font-bold">78%</p>
                      <p className="text-sm opacity-80 mt-2">12 of 15 tasks completed</p>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 border">
                      <h3 className="text-xl font-semibold mb-2">Level {currentLevel}</h3>
                      <p className="text-4xl font-bold">{coinsEarned} <span className="text-amber-500">★</span></p>
                      <p className="text-sm text-muted-foreground mt-2">coins earned</p>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 border">
                      <h3 className="text-xl font-semibold mb-2">Current Streak</h3>
                      <p className="text-4xl font-bold">7 <span className="text-sm">days</span></p>
                      <p className="text-sm text-muted-foreground mt-2">Keep it going!</p>
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-6 border">
                      <h3 className="text-xl font-semibold mb-2">Rewards Shop</h3>
                      <p className="text-sm text-muted-foreground mb-3">Spend your coins on rewards!</p>
                      <Button onClick={() => setShopOpen(true)}>View Shop</Button>
                    </div>
                  </div>
                </section>
                
                <section className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Today's Tasks</h3>
                    <div className="space-y-2">
                      {[
                        { title: "Project presentation", completed: true },
                        { title: "Team meeting", completed: true },
                        { title: "Review code PR", completed: false },
                        { title: "Update documentation", completed: false },
                      ].map((task, i) => (
                        <div key={i} className="flex items-center gap-2 bg-card text-card-foreground rounded p-3 border">
                          <input 
                            type="checkbox" 
                            checked={task.completed} 
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Leaderboard</h3>
                    <Leaderboard />
                  </div>
                </section>
                
                <section>
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: "Completed task", target: "Prepare meeting notes", time: "2 hours ago" },
                      { action: "Earned achievement", target: "Early Riser", time: "Yesterday" },
                      { action: "Created goal", target: "Learn guitar", time: "2 days ago" },
                    ].map((activity, i) => (
                      <div key={i} className="bg-card text-card-foreground rounded p-3 border">
                        <p className="font-medium">{activity.action}: {activity.target}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col gap-4 md:h-14 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            © 2023 LifeTrackPro. All rights reserved.
          </p>
          
          <nav className="flex gap-4 order-1 md:order-2">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </footer>

      {/* Riya Chat */}
      <RiyaChat />

      {/* Popups */}
      {showRewardPopup && (
        <RewardPopup isOpen={showRewardPopup} onClose={() => setShowRewardPopup(false)} />
      )}

      {showDailyQuote && (
        <DailyQuote isOpen={showDailyQuote} onClose={() => setShowDailyQuote(false)} />
      )}

      {/* Shop Dialog */}
      <ShopDialog isOpen={shopOpen} onClose={() => setShopOpen(false)} />
    </div>
  );
} 