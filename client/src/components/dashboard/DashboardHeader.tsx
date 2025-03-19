import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <header className="bg-primary/10 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/habits">Habits</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/finances">Finances</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
