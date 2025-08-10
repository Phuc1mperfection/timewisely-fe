import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

type PomodoroPhase = 'pomodoro' | 'shortBreak' | 'longBreak' | 'idle';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  currentPhase: PomodoroPhase;
  completedPomodoros: number;
  sessionsUntilLongBreak: number;
  dailyStreak: number;
  weeklyProgress: number;
}

const DEFAULT_DURATIONS = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

interface CustomDurations {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export const usePomodoroTimer = () => {
  const { success,info } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load custom durations from localStorage
  const [durations, setDurations] = useState<CustomDurations>(() => {
    const saved = localStorage.getItem('pomodoroDurations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_DURATIONS;
      }
    }
    return DEFAULT_DURATIONS;
  });

  const [state, setState] = useState<PomodoroState>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('pomodoroState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isRunning: false, // Never start running on load
          timeLeft: parsed.timeLeft || DEFAULT_DURATIONS.pomodoro,
        };
      } catch {
        // Fall back to default if parsing fails
      }
    }
    
    return {
      timeLeft: DEFAULT_DURATIONS.pomodoro,
      isRunning: false,
      currentPhase: 'idle',
      completedPomodoros: 0,
      sessionsUntilLongBreak: 4,
      dailyStreak: 0,
      weeklyProgress: 0,
    };
  });

  // Save durations to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pomodoroDurations', JSON.stringify(durations));
  }, [durations]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [state]);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeLeft]);

  // Handle phase completion
  useEffect(() => {
    if (state.isRunning && state.timeLeft === 0) {
      handlePhaseComplete();
    }
  }, [state.timeLeft, state.isRunning]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      // Create a simple beep sound using Web Audio API if no audio file
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const handlePhaseComplete = useCallback(() => {
    playNotificationSound();

    setState(prev => {
      let newPhase: PomodoroPhase;
      let newCompletedPomodoros = prev.completedPomodoros;
      let newSessionsUntilLongBreak = prev.sessionsUntilLongBreak;
      let newDailyStreak = prev.dailyStreak;
      let newWeeklyProgress = prev.weeklyProgress;

      if (prev.currentPhase === 'pomodoro') {
        newCompletedPomodoros += 1;
        newWeeklyProgress += 1;
        newSessionsUntilLongBreak -= 1;

        // Update daily streak
        const lastPomodoroDate = localStorage.getItem('lastPomodoroDate');
        const today = new Date().toDateString();
        
        if (lastPomodoroDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastPomodoroDate === yesterday.toDateString()) {
            newDailyStreak += 1;
          } else {
            newDailyStreak = 1; // Reset streak
          }
          
          localStorage.setItem('lastPomodoroDate', today);
        }

        if (newSessionsUntilLongBreak === 0) {
          newPhase = 'longBreak';
          newSessionsUntilLongBreak = 4; // Reset for next cycle
        } else {
          newPhase = 'shortBreak';
        }

        success("Pomodoro Complete! 🎉 Take a well-deserved break.");
      } else {
        newPhase = 'pomodoro';
        info("Break Over! ⏰ Ready to focus again?");
      }

      return {
        ...prev,
        timeLeft: durations[newPhase],
        isRunning: false,
        currentPhase: newPhase,
        completedPomodoros: newCompletedPomodoros,
        sessionsUntilLongBreak: newSessionsUntilLongBreak,
        dailyStreak: newDailyStreak,
        weeklyProgress: newWeeklyProgress,
      };
    });
  }, [durations, success, info]);

  const startTimer = useCallback(() => {
    setState(prev => {
      const newPhase = prev.currentPhase === 'idle' ? 'pomodoro' : prev.currentPhase;
      return {
        ...prev,
        isRunning: true,
        currentPhase: newPhase,
        timeLeft: prev.timeLeft || durations[newPhase],
      };
    });
  }, [durations]);

  const pauseTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: durations[prev.currentPhase === 'idle' ? 'pomodoro' : prev.currentPhase],
    }));
  }, [durations]);

  const skipPhase = useCallback(() => {
    setState(prev => ({
      ...prev,
      timeLeft: 0
    }));
  }, []);

  const updateDurations = useCallback((newDurations: CustomDurations) => {
    setDurations(newDurations);
    // If timer is idle, update the time left to reflect new durations
    setState(prev => {
      if (prev.currentPhase === 'idle') {
        return {
          ...prev,
          timeLeft: newDurations.pomodoro,
        };
      }
      return prev;
    });
  }, []);

  return {
    ...state,
    durations,
    startTimer,
    pauseTimer,
    stopTimer,
    skipPhase,
    updateDurations,
  };
};