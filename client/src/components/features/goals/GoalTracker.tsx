import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Checkbox } from '../../ui/checkbox';
import { useGoalStore } from '../../../stores/goalStore';
import { Plus, Trophy } from 'lucide-react';

export const GoalTracker: React.FC = () => {
  const { goals, addGoal, toggleMilestone } = useGoalStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Goals</h2>
        <Button onClick={() => addGoal({
          id: Date.now().toString(),
          title: 'New Goal',
          description: 'Add your goal description',
          progress: 0,
          milestones: [],
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        })}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {goal.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Milestones</h4>
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={milestone.id}
                        checked={milestone.completed}
                        onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                      />
                      <label
                        htmlFor={milestone.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {milestone.title}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Deadline: {goal.deadline.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 