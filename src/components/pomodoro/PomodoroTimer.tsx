import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PomodoroTimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  timeLeft,
  totalTime,
  isRunning
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="space-y-6">
      {/* Circular Timer Display */}
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted-foreground/20"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 90}`}
            strokeDashoffset={`${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`}
            className="text-primary transition-all duration-1000 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Time display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold transition-colors duration-300 ${
            isRunning ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {isRunning ? 'Focus Time' : 'Paused'}
          </div>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};  