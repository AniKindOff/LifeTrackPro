import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Habit } from "@shared/schema";

interface HabitWidgetProps {
  habits: Habit[];
}

export default function HabitWidget({ habits }: HabitWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habits Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{habit.name}</span>
                <span className="text-sm text-muted-foreground">{habit.frequency}</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
