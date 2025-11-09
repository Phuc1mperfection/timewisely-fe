import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Coffee, RotateCcw, TrendingUp } from "lucide-react";
import type { UserSettings } from "@/services/pomodoroServices";

interface PomodoroCounterProps {
  settings: UserSettings | null;
  onResetCount: () => void;
}

export const PomodoroCounter: React.FC<PomodoroCounterProps> = ({
  settings,
  onResetCount,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  if (!settings) return null;

  const completedCount = settings.completedFocusCount || 0;
  const interval = settings.longBreakInterval || 4;
  const progress = (completedCount % interval) / interval;
  const sessionsUntilLongBreak = interval - (completedCount % interval);

  // Create tomato icons for visual progress
  const tomatoIcons = Array.from({ length: interval }, (_, i) => {
    const isCompleted = i < completedCount % interval;
    return (
      <div
        key={i}
        className={`text-2xl transition-all ${
          isCompleted ? "opacity-100 scale-110" : "opacity-30 grayscale"
        }`}
      >
        🍅
      </div>
    );
  });

  return (
    <>
      {/* Compact Counter Display */}
      <Card
        className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/50"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Tomato Progress */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">{tomatoIcons}</div>

              {/* Total Count Badge */}
              <Badge
                variant="outline"
                className="text-sm font-mono font-semibold px-2 py-1 border-primary/30"
              >
                #{completedCount}
              </Badge>
            </div>

            {/* Right: Count Badge */}
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="secondary"
                className="text-lg font-bold px-3 py-1"
              >
                {completedCount % interval}/{interval}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {sessionsUntilLongBreak === interval
                  ? "Start your first!"
                  : sessionsUntilLongBreak === 0
                  ? "Time for long break!"
                  : `${sessionsUntilLongBreak} until long break`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Pomodoro Progress
            </DialogTitle>
            <DialogDescription>
              Track your focus sessions and upcoming breaks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Current Cycle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Cycle</span>
                <Badge variant="outline" className="text-lg font-bold">
                  {completedCount % interval} / {interval}
                </Badge>
              </div>

              {/* Visual Tomatoes */}
              <div className="flex justify-center gap-2 py-4">
                {tomatoIcons}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress: {Math.round(progress * 100)}%</span>
                  <span>
                    {sessionsUntilLongBreak === 0
                      ? "Ready for long break! ☕"
                      : `${sessionsUntilLongBreak} more to go`}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-3xl font-bold text-primary">
                  {completedCount}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Total Focus Sessions
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-3xl font-bold text-orange-600">
                  {Math.floor(completedCount / interval)}
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  Long Breaks Earned
                </span>
              </div>
            </div>

            {/* Next Break Info */}
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Coffee className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Next Break</p>
                <p className="text-xs text-muted-foreground">
                  {sessionsUntilLongBreak === 0
                    ? "Long Break (15 min) - Well deserved! 🌟"
                    : sessionsUntilLongBreak === interval
                    ? "Complete a focus session to unlock"
                    : `Short Break (5 min) after next session`}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    "Reset pomodoro count? This will start a new cycle from 0."
                  )
                ) {
                  onResetCount();
                  setIsDialogOpen(false);
                }
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Count
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
