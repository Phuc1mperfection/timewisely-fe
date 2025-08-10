import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, Calendar, TrendingUp } from "lucide-react";

interface PomodoroStatsProps {
  dailyStreak: number;
  weeklyProgress: number;
  completedPomodoros: number;
}

export const PomodoroStats: React.FC<PomodoroStatsProps> = ({
  dailyStreak,
  weeklyProgress,
  completedPomodoros,
}) => {
  const dailyGoal = 8; // 8 pomodoros per day
  const todayProgress = ((completedPomodoros % dailyGoal) / dailyGoal) * 100;

  return (
    <div className="space-y-4">
      {/* Daily Streak */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-orange-500" />
            Daily Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {dailyStreak}
            </div>
            <div className="text-sm text-muted-foreground">
              {dailyStreak === 1 ? "day" : "days"} in a row
            </div>
            <Badge
              variant={dailyStreak >= 7 ? "default" : "secondary"}
              className="mt-2"
            >
              {dailyStreak >= 7 ? "🔥 On Fire!" : "💪 Keep Going!"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Completed</span>
            <span className="font-medium">
              {completedPomodoros % dailyGoal} / {dailyGoal}
            </span>
          </div>
          <Progress value={todayProgress} className="h-2" />
          <div className="text-center text-sm text-muted-foreground">
            {Math.round(todayProgress)}% complete
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-green-500" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {weeklyProgress}
            </div>
            <div className="text-sm text-muted-foreground">
              pomodoros completed
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Weekly Goal</span>
              <span className="font-medium">{weeklyProgress} / 40</span>
            </div>
            <Progress value={(weeklyProgress / 40) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold">{completedPomodoros}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="p-2 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold">
                {Math.round((completedPomodoros * 25) / 60)}h
              </div>
              <div className="text-xs text-muted-foreground">Focus Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
