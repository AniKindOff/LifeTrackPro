import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, Settings, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppLogo } from "@/components/AppLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [useCustomLogo, setUseCustomLogo] = useState(false);
  
  // Get the first letter of username for avatar
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };
  
  // Check localStorage for custom logo preference
  useEffect(() => {
    const storedPref = localStorage.getItem('useCustomLogo');
    setUseCustomLogo(storedPref === 'true');
    
    // Listen for changes in local storage from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'useCustomLogo') {
        setUseCustomLogo(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo size={32} useCustomLogo={useCustomLogo} className="mr-2" />
            <span className="hidden font-bold sm:inline-block">
              Habit & Finance Tracker
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/habits" className="transition-colors hover:text-primary">
              Habits
            </Link>
            <Link href="/finances" className="transition-colors hover:text-primary">
              Finances
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <AppLogo size={32} useCustomLogo={useCustomLogo} />
              <span className="font-bold">Habit & Finance Tracker</span>
            </Link>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-lg font-medium">
                Dashboard
              </Link>
              <Link href="/habits" className="text-lg font-medium">
                Habits
              </Link>
              <Link href="/finances" className="text-lg font-medium">
                Finances
              </Link>
              <Link href="/profile" className="text-lg font-medium">
                Profile
              </Link>
              <Link href="/settings" className="text-lg font-medium">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">App Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/logo">Change Logo</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(user?.username || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => logoutMutation.mutate({})}
                className="text-destructive"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}