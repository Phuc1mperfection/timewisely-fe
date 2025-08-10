import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { TaskSelector } from '@/components/pomodoro/TaskSelector';
import { PomodoroStats } from '@/components/pomodoro/PomodoroStats';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';


const PomodoroPage: React.FC = () => {
  const { success, error } = useToast();
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [customTask, setCustomTask] = useState<string>('');
  
  const {
    timeLeft,
    isRunning,
    currentPhase,
    completedPomodoros,
    sessionsUntilLongBreak,
    dailyStreak,
    weeklyProgress,
    durations,
    startTimer,
    pauseTimer,
    stopTimer,
    skipPhase,
    updateDurations
  } = usePomodoroTimer();

  // Settings dialog state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempDurations, setTempDurations] = useState(durations);

  // Sync temp durations when durations change
  useEffect(() => {
    setTempDurations(durations);
  }, [durations]);

  const getCurrentTask = () => {
    return customTask || selectedTask || 'Focus Session';
  };

  const handleStart = () => {
    if (!selectedTask && !customTask) {
      error("Select a task, Please select or enter a task to focus on.");
      return;
    }
    startTimer();
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'pomodoro':
        return 'text-red-600';
      case 'shortBreak':
        return 'text-green-600';
      case 'longBreak':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold mb-2">Focus Timer</h1>
          <p className="text-muted-foreground">Stay focused and productive with the Pomodoro Technique</p>
          
          {/* Settings Button */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-0 right-0 gap-2"
                onClick={() => setTempDurations(durations)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pomodoro" className="text-right">
                    Pomodoro
                  </Label>
                  <Input
                    id="pomodoro"
                    type="number"
                    min="1"
                    max="60"
                    value={tempDurations.pomodoro / 60}
                    onChange={(e) => setTempDurations(prev => ({
                      ...prev,
                      pomodoro: parseInt(e.target.value || '25') * 60
                    }))}
                    className="col-span-2"
                  />
                  <Label className="text-muted-foreground">min</Label>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortBreak" className="text-right">
                    Short Break
                  </Label>
                  <Input
                    id="shortBreak"
                    type="number"
                    min="1"
                    max="30"
                    value={tempDurations.shortBreak / 60}
                    onChange={(e) => setTempDurations(prev => ({
                      ...prev,
                      shortBreak: parseInt(e.target.value || '5') * 60
                    }))}
                    className="col-span-2"
                  />
                  <Label className="text-muted-foreground">min</Label>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longBreak" className="text-right">
                    Long Break
                  </Label>
                  <Input
                    id="longBreak"
                    type="number"
                    min="1"
                    max="60"
                    value={tempDurations.longBreak / 60}
                    onChange={(e) => setTempDurations(prev => ({
                      ...prev,
                      longBreak: parseInt(e.target.value || '15') * 60
                    }))}
                    className="col-span-2"
                  />
                  <Label className="text-muted-foreground">min</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateDurations(tempDurations);
                  setIsSettingsOpen(false);
                  success("Settings saved successfully!");
                }}>
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Timer Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Timer Card */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Timer className={`h-5 w-5 ${getPhaseColor()}`} />
                  <Badge variant="outline" className={getPhaseColor()}>
                    {getPhaseLabel()}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{getCurrentTask()}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <PomodoroTimer 
                  timeLeft={timeLeft}
                  totalTime={durations[currentPhase === 'idle' ? 'pomodoro' : currentPhase]}
                  isRunning={isRunning}
                />
                
                {/* Control Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  {!isRunning ? (
                    <Button 
                      onClick={handleStart} 
                      size="lg"
                      className="gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseTimer} 
                      size="lg" 
                      variant="outline"
                      className="gap-2"
                    >
                      <Pause className="h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  
                  <Button 
                    onClick={stopTimer} 
                    size="lg" 
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                  
                  <Button 
                    onClick={skipPhase} 
                    size="lg" 
                    variant="ghost"
                  >
                    Skip
                  </Button>
                </div>

                {/* Session Progress */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    Session Progress
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {completedPomodoros} / 4
                  </div>
                  <Progress 
                    value={(completedPomodoros % 4) * 25} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {sessionsUntilLongBreak} session(s) until long break
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Card */}
          <div>
            <PomodoroStats 
              dailyStreak={dailyStreak}
              weeklyProgress={weeklyProgress}
              completedPomodoros={completedPomodoros}
            />
          </div>
        </div>

        {/* Task Selection */}
        <TaskSelector 
          selectedTask={selectedTask}
          onTaskSelect={setSelectedTask}
          customTask={customTask}
          onCustomTaskChange={setCustomTask}
        />
      </div>
    </div>
  );
};

export default PomodoroPage;