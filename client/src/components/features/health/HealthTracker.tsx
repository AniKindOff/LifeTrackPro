import React from 'react';
import { Droplet, Heart } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';

interface HealthTrackerProps {
  onWaterAdd: () => void;
  onMoodUpdate: (mood: string) => void;
  waterIntake: number;
  currentMood: string;
  waterGoal: number;
}

export const HealthTracker: React.FC<HealthTrackerProps> = ({
  onWaterAdd,
  onMoodUpdate,
  waterIntake,
  currentMood,
  waterGoal,
}) => {
  const moods = ['😊 Happy', '😐 Neutral', '😔 Sad', '😤 Stressed', '😴 Tired'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Water Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{waterIntake}ml / {waterGoal}ml</span>
              <Button onClick={onWaterAdd} size="sm">
                Add 250ml
              </Button>
            </div>
            <Progress value={(waterIntake / waterGoal) * 100} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood}
                variant={currentMood === mood ? 'default' : 'outline'}
                onClick={() => onMoodUpdate(mood)}
                className="h-auto py-2"
              >
                {mood}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 