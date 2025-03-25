import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Trophy } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Sidebar = () => {
  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        >
          <Activity className="h-5 w-5" />
          <span>Productivity</span>
        </Link>
        <Link
          to="/health"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        >
          <Heart className="h-5 w-5" />
          <span>Health</span>
        </Link>
        <Link
          to="/goals"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        >
          <Trophy className="h-5 w-5" />
          <span>Goals</span>
        </Link>
      </nav>
      <div className="mt-4">
        <ModeToggle />
      </div>
    </aside>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}; 