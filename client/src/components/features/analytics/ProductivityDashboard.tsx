import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { useProductivityStore } from '../../../stores/productivityStore';

const data = [
  { name: 'Mon', tasks: 4, completed: 3 },
  { name: 'Tue', tasks: 6, completed: 4 },
  { name: 'Wed', tasks: 5, completed: 5 },
  { name: 'Thu', tasks: 7, completed: 6 },
  { name: 'Fri', tasks: 8, completed: 7 },
  { name: 'Sat', tasks: 3, completed: 2 },
  { name: 'Sun', tasks: 2, completed: 1 },
];

export const ProductivityDashboard: React.FC = () => {
  const { productivityScore, focusTime } = useProductivityStore();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Productivity Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{productivityScore}%</div>
          <p className="text-xs text-muted-foreground">+2.1% from last week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{focusTime}h</div>
          <p className="text-xs text-muted-foreground">+1.2h from last week</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#8884d8" name="Total Tasks" />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 