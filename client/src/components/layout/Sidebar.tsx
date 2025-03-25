import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart, 
  Target, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRiya } from '@/hooks/use-riya';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { coinsEarned, level } = useRiya();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/analytics', icon: BarChart, label: 'Analytics' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "bg-gradient-to-b from-[hsl(var(--gradient-start)/0.9)] via-[hsl(var(--gradient-mid)/0.9)] to-[hsl(var(--gradient-end)/0.9)] text-white transition-all duration-300 shadow-lg flex flex-col h-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <h1 className="text-xl font-bold text-white">LifeTrackPro</h1>
        )}
        <Button 
          onClick={toggleSidebar}
          variant="ghost"
          className="p-2 rounded-md hover:bg-white/10 text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-white/80 hover:bg-white/10 transition-colors",
                    isActive && "bg-white/20 text-white font-medium",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon size={20} className={cn(isActive && "text-white")} />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        {!collapsed ? (
          <div className="glass-effect rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Level</span>
              <span className="text-sm font-medium text-white">{level}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/80">Coins</span>
              <span className="text-sm font-medium text-white">{coinsEarned}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 glass-effect rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{level}</span>
            </div>
            <span className="text-xs font-medium text-white">{coinsEarned}</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 