import React from "react";
import { Pause, Square, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from "./PomodoroTimer";
import type { PomodoroSession } from "@/services/pomodoroServices";
import type { Task } from "@/services/taskServices";

interface PomodoroTimerCardProps {
  session: PomodoroSession | null;
  selectedSessionType: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  setSelectedSessionType: (
    type: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK"
  ) => void;
  displayTimeLeft: number;
  displayTotalTime: number;
  isRunning: boolean;
  isLoading: boolean;
  selectedTaskId: number | undefined;
  customTask: string;
  tasks: Task[];
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
  getCurrentTask: () => string;
}

export const PomodoroTimerCard: React.FC<PomodoroTimerCardProps> = ({
  session,
  selectedSessionType,
  setSelectedSessionType,
  displayTimeLeft,
  displayTotalTime,
  isRunning,
  isLoading,
  selectedTaskId,
  customTask,
  tasks,
  onStart,
  onPause,
  onStop,
  onSkip,
  getCurrentTask,
}) => {
  const getPhaseColor = () => {
    if (!session) return "text-muted-foreground";

    switch (session.sessionType) {
      case "FOCUS":
        return "text-red-600";
      case "SHORT_BREAK":
        return "text-green-600";
      case "LONG_BREAK":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getPhaseLabel = () => {
    if (!session) return "Ready";

    switch (session.sessionType) {
      case "FOCUS":
        return "Focus Time";
      case "SHORT_BREAK":
        return "Short Break";
      case "LONG_BREAK":
        return "Long Break";
      default:
        return "Ready";
    }
  };

  return (
    <div className="mb-6">
      <Card className="max-w-2xl mx-auto">
        {/* Session Type Tabs */}
        <Tabs
          value={session ? session.sessionType : selectedSessionType}
          onValueChange={(value) => {
            if (!session) {
              setSelectedSessionType(
                value as "FOCUS" | "SHORT_BREAK" | "LONG_BREAK"
              );
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted/30 rounded-none border-b h-auto p-2">
            <TabsTrigger
              value="FOCUS"
              disabled={!!session}
              className="text-sm font-medium data-[state=active]:bg-background"
            >
              Pomodoro
            </TabsTrigger>
            <TabsTrigger
              value="SHORT_BREAK"
              disabled={!!session}
              className="text-sm font-medium data-[state=active]:bg-background"
            >
              Short Break
            </TabsTrigger>
            <TabsTrigger
              value="LONG_BREAK"
              disabled={!!session}
              className="text-sm font-medium data-[state=active]:bg-background"
            >
              Long Break
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <CardHeader className="text-center pb-2 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className={`h-5 w-5 ${getPhaseColor()}`} />
            <Badge variant="outline" className={getPhaseColor()}>
              {getPhaseLabel()}
            </Badge>
          </div>
          <CardTitle className="text-lg">
            {session
              ? getCurrentTask()
              : selectedSessionType === "SHORT_BREAK"
              ? "Time for a short break"
              : selectedSessionType === "LONG_BREAK"
              ? "Time for a long break"
              : getCurrentTask()}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <PomodoroTimer
            timeLeft={displayTimeLeft}
            totalTime={displayTotalTime}
            isRunning={isRunning}
          />

          {/* Control Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            {!session ? (
              <Button
                onClick={onStart}
                size="lg"
                className="gap-2 px-12 h-14 text-lg font-semibold rounded-md bg-white text-primary hover:bg-white/90 border-b-4 border-primary/30 transition-all"
                disabled={
                  isLoading ||
                  (selectedSessionType === "FOCUS" &&
                    !selectedTaskId &&
                    !customTask)
                }
              >
                Start
              </Button>
            ) : !isRunning ? (
              <Button
                onClick={onPause}
                size="lg"
                className="gap-2 px-12 h-14 text-lg font-semibold rounded-md bg-white text-primary hover:bg-white/90 border-b-4 border-primary/30 transition-all"
                disabled={isLoading}
              >
                Resume
              </Button>
            ) : (
              <Button
                onClick={onPause}
                size="lg"
                className="gap-2 px-12 h-14 text-lg font-semibold rounded-md bg-white text-primary hover:bg-white/90 border-b-4 border-primary/30 transition-all"
                disabled={isLoading}
              >
                <Pause className="h-5 w-5" />
                Pause
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          {session && (
            <div className="flex justify-center gap-3 mt-4">
              <Button
                onClick={onStop}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                disabled={isLoading}
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
              <Button
                onClick={onSkip}
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                disabled={isLoading}
              >
                Skip
              </Button>
            </div>
          )}

          {/* Task Progress Info */}
          {selectedTaskId &&
            session &&
            (session.status === "RUNNING" || session.status === "PAUSED") && (
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                {(() => {
                  const task = tasks.find((t) => t.id === selectedTaskId);
                  if (!task) return null;

                  const actualPomodoros = task.completedPomodoros || 0;
                  const estimatedPomodoros = task.estimatedPomodoros || 1;
                  const currentInProgress = actualPomodoros + 1;
                  const percentage =
                    (currentInProgress / estimatedPomodoros) * 100;
                  const remaining = estimatedPomodoros - currentInProgress;

                  return (
                    <div className="space-y-3">
                      {/* Task Name */}
                      <div className="text-center">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          {task.name}
                        </h3>
                      </div>

                      {/* Act / Est Display */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            Act
                          </div>
                          <div className="text-2xl font-bold">
                            {actualPomodoros.toFixed(1)}
                          </div>
                        </div>

                        <div className="text-2xl text-muted-foreground font-light">
                          /
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">
                            Est
                          </div>
                          <div className="text-2xl font-bold">
                            {estimatedPomodoros.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className="h-2"
                        />
                        <div className="text-xs text-center text-muted-foreground mt-1">
                          {remaining > 0
                            ? `${remaining.toFixed(1)} more to complete`
                            : currentInProgress > estimatedPomodoros
                            ? `${(
                                currentInProgress - estimatedPomodoros
                              ).toFixed(1)} over estimate`
                            : "Final pomodoro! 🎉"}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};
