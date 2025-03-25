import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  PieChart, 
  Target, 
  Clock, 
  Settings, 
  Book, 
  Briefcase, 
  ShoppingBag, 
  Heart, 
  Music, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Coins 
} from 'lucide-react';
import { useRiya } from '@/hooks/use-riya';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShopDialog } from './gamification/ShopDialog';
import { useMediaQuery } from '@/hooks/use-media-query';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [shopOpen, setShopOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');
  const { pathname } = useLocation();
  const { coinsEarned } = useRiya();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Close sidebar on mobile by default
    if (isMobile) {
      setExpanded(false);
    }
    
    setMounted(true);
  }, [isMobile]);
  
  // Auto collapse on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setExpanded(false);
    }
  }, [pathname, isMobile]);

  const mainNavItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/tasks', label: 'Tasks', icon: <Briefcase className="h-5 w-5" />, badge: '3' },
    { path: '/goals', label: 'Goals', icon: <Target className="h-5 w-5" /> },
    { path: '/habits', label: 'Habits', icon: <Calendar className="h-5 w-5" /> },
    { path: '/focus', label: 'Focus Timer', icon: <Clock className="h-5 w-5" /> },
    { path: '/journal', label: 'Journal', icon: <Book className="h-5 w-5" /> },
    { path: '/analytics', label: 'Analytics', icon: <PieChart className="h-5 w-5" /> },
  ];
  
  const secondaryNavItems: NavItem[] = [
    { path: '/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  if (!mounted) return null;

  return (
    <>
      <div 
        className={`sidebar-overlay ${expanded && isMobile ? 'sidebar-overlay-visible' : ''}`} 
        onClick={() => setExpanded(false)}
      />
      
      <aside 
        className={`sidebar fixed left-0 top-0 z-50 flex h-full flex-col bg-card border-r border-border shadow-lg transition-all duration-300 ${
          expanded ? 'w-64' : 'w-[70px]'
        } ${isMobile ? 'transform' : ''} ${
          isMobile && !expanded ? '-translate-x-full sm:translate-x-0' : ''
        }`}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3">
          {expanded ? (
            <Link to="/" className="flex items-center gap-2 slide-up">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                L
              </div>
              <h1 className="text-xl font-bold tracking-tight">LifeTrackPro</h1>
            </Link>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              L
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 lg:hidden" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="scrollable-sidebar flex flex-col flex-grow overflow-y-auto py-2">
          {expanded && (
            <div className="user-greeting px-4 py-3 mb-2 slide-up">
              <p className="text-sm text-muted-foreground">{greeting},</p>
              <p className="font-semibold truncate">{userName}</p>
            </div>
          )}
          
          <div 
            className="px-3 py-2"
            onClick={() => setShopOpen(true)}
          >
            <Button 
              variant="outline" 
              className={`w-full justify-start gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 border-amber-200 dark:border-amber-800 shimmer-subtle ${expanded ? '' : 'justify-center'}`}
            >
              <Coins className="h-5 w-5 text-amber-500" />
              {expanded && (
                <span className="font-bold text-amber-600">{coinsEarned} coins</span>
              )}
            </Button>
          </div>
          
          <div className="px-2 py-2">
            <p className={`text-xs font-semibold text-muted-foreground px-3 py-1 ${expanded ? '' : 'sr-only'}`}>
              MAIN MENU
            </p>
            <nav className="flex flex-col gap-1">
              {mainNavItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    nav-item flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-300
                    ${pathname === item.path ? 'nav-item-active' : 'hover:bg-accent'}
                    ${expanded ? '' : 'justify-center'}
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={pathname === item.path ? 'text-primary' : 'text-muted-foreground'}>
                    {item.icon}
                  </div>
                  
                  {expanded && (
                    <span className={pathname === item.path ? 'font-medium text-primary' : ''}>
                      {item.label}
                    </span>
                  )}
                  
                  {expanded && item.badge && (
                    <Badge variant="secondary" className="ml-auto h-5 min-w-5 flex items-center justify-center">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="px-2 py-2 mt-4">
            {expanded && (
              <p className="text-xs font-semibold text-muted-foreground px-3 py-1">
                OTHER
              </p>
            )}
            <nav className="flex flex-col gap-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    nav-item flex items-center gap-3 rounded-md px-3 py-2 transition-all
                    ${pathname === item.path ? 'nav-item-active' : 'hover:bg-accent'}
                    ${expanded ? '' : 'justify-center'}
                  `}
                >
                  <div className={pathname === item.path ? 'text-primary' : 'text-muted-foreground'}>
                    {item.icon}
                  </div>
                  
                  {expanded && (
                    <span className={pathname === item.path ? 'font-medium text-primary' : ''}>
                      {item.label}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="sidebar-footer border-t border-border p-3">
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/20 ${expanded ? '' : 'justify-center'}`}
          >
            <LogOut className="h-5 w-5" />
            {expanded && (
              <span>Logout</span>
            )}
          </Button>
        </div>
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-24 h-6 w-6 rounded-full border bg-background shadow-md"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Button>
        )}
      </aside>
      
      {/* Mobile menu toggle */}
      {isMobile && !expanded && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg border"
          onClick={() => setExpanded(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      {/* Shop dialog */}
      <ShopDialog isOpen={shopOpen} onClose={() => setShopOpen(false)} />
    </>
  );
}; 