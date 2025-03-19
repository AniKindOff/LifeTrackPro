import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import type { Habit } from "@shared/schema";
import { Link } from "wouter";

interface HabitWidgetProps {
  habits: Habit[];
}

export default function HabitWidget({ habits }: HabitWidgetProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Habits Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your daily progress
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {habits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No habits added yet</p>
              <Link href="/habits" className="text-primary hover:underline mt-2 inline-block">
                Add your first habit
              </Link>
            </div>
          ) : (
            habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {habit.frequency} • Target: {habit.target}
                    </p>
                  </div>
                  <span className="text-sm font-medium">33%</span>
                </div>
                <Progress value={33} className="h-2" />
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}