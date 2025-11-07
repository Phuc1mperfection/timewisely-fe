import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import { AxiosError } from "axios";
import {
  startPomodoroSession,
  getActiveSession,
  pauseSession,
  resumeSession,
  completeSession,
  cancelSession,
  getUserSettings,
  type PomodoroSession,
  type UserSettings,
  type StartPomodoroRequest,
} from "@/services/pomodoroServices";

interface UsePomodoroSessionReturn {
  // Session state
  session: PomodoroSession | null;
  isLoading: boolean;
  error: string | null;

  // Timer state
  timeLeft: number;
  isRunning: boolean;

  // Settings
  settings: UserSettings | null;

  // Actions
  startSession: (request: StartPomodoroRequest) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  complete: () => Promise<void>;
  cancel: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshSettings: () => Promise<void>;

  // Computed values
  progress: number; // 0-100
  totalTime: number;
}

interface UsePomodoroSessionOptions {
  onSessionComplete?: (completedSession: PomodoroSession) => void;
}

export const usePomodoroSession = (
  options?: UsePomodoroSessionOptions
): UsePomodoroSessionReturn => {
  const { success, info, handleError } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCompletingRef = useRef<boolean>(false); // Prevent double refresh
  const onSessionComplete = options?.onSessionComplete;

  // State
  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
  }, []);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || window.AudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.error("Failed to play notification sound:", err);
    }
  }, []);

  // Load user settings
  const loadSettings = useCallback(async () => {
    try {
      const userSettings = await getUserSettings();
      setSettings(userSettings);
    } catch (err) {
      console.error("Failed to load settings:", err);
      // Don't show error to user for settings load failure
    }
  }, []); // Empty deps - function is stable

  // Load active session
  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activeSession = await getActiveSession();

      setSession(activeSession);

      if (activeSession) {
        setTimeLeft(activeSession.remainingTime);
      } else {
        setTimeLeft(0);
      }
    } catch (err) {
      console.error("Failed to refresh session:", err);
      let errorMessage: string;

      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message || "Failed to load session";
      } else {
        errorMessage = "Failed to load session";
      }

      setError(errorMessage);
      setSession(null);
      setTimeLeft(0);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - function is stable

  // Initial load - only once on mount
  useEffect(() => {
    loadSettings();
    refreshSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array = run only once on mount

  // Timer countdown logic - only runs when session is RUNNING
  useEffect(() => {
    if (session?.status === "RUNNING" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed - use flag to prevent double call
            if (isCompletingRef.current) {
              return 0;
            }
            isCompletingRef.current = true;

            // Play sound and show notification
            playNotificationSound();
            const sessionType = session?.sessionType;
            if (sessionType === "FOCUS") {
              success("Pomodoro Complete! 🎉 Take a well-deserved break.");
            } else {
              info("Break Over! ⏰ Ready to focus again?");
            }

            // Complete the session (call backend API to mark as complete)
            if (session) {
              const completedSession = { ...session }; // Store session before clearing
              completeSession(session.id)
                .then(() => {
                  // Trigger callback before refreshing
                  if (onSessionComplete) {
                    onSessionComplete(completedSession);
                  }
                  // After completing, refresh to get updated state
                  return refreshSession();
                })
                .catch((err) => {
                  console.error("Failed to auto-complete session:", err);
                  // Still refresh to get latest state
                  return refreshSession();
                })
                .finally(() => {
                  isCompletingRef.current = false;
                });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); //clearinterval là hàm dùng để dừng bộ đếm thời gian
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // refreshSession is stable (empty deps), safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    session?.status,
    session?.sessionType,
    timeLeft,
    playNotificationSound,
    success,
    info,
  ]);

  // Start new session
  const startSession = useCallback(
    async (request: StartPomodoroRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const newSession = await startPomodoroSession(request);
        setSession(newSession);
        setTimeLeft(newSession.remainingTime);
        success("Focus session started! 🍅");
      } catch (err) {
        // ✨ Clean code: One line to handle all error types
        const errorMessage = handleError(
          err,
          "Failed to start session",
          "Start Session"
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [success, handleError]
  );

  // Pause session
  const pause = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);
      const updatedSession = await pauseSession(session.id);
      setSession(updatedSession);
      info("Session paused");
    } catch (err) {
      const errorMessage = handleError(
        err,
        "Failed to pause session",
        "Pause Session"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, info, handleError]);

  // Resume session
  const resume = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);
      const updatedSession = await resumeSession(session.id);
      setSession(updatedSession);
      setTimeLeft(updatedSession.remainingTime);
      success("Session resumed!");
    } catch (err) {
      const errorMessage = handleError(
        err,
        "Failed to resume session",
        "Resume Session"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, success, handleError]);

  // Complete session
  const complete = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await completeSession(session.id);

      playNotificationSound();
      success("Session completed! 🎉");

      // Clear session state
      setSession(null);
      setTimeLeft(0);

      // Refresh to check for new session or clear state
      await refreshSession();
    } catch (err) {
      const errorMessage = handleError(
        err,
        "Failed to complete session",
        "Complete Session"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, success, handleError, playNotificationSound, refreshSession]);

  // Cancel session
  const cancel = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError(null);
      await cancelSession(session.id);

      // Clear session state completely to reset UI to initial state
      setSession(null);
      setTimeLeft(0);
      info("Session cancelled");
    } catch (err) {
      const errorMessage = handleError(
        err,
        "Failed to cancel session",
        "Cancel Session"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session, info, handleError]);

  // Computed values
  const isRunning = session?.status === "RUNNING";
  const totalTime = session
    ? session.duration * 60 // Convert minutes to seconds (backend uses 'duration')
    : settings?.focusDuration
    ? settings.focusDuration * 60
    : 25 * 60;
  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return {
    session,
    isLoading,
    error,
    timeLeft,
    isRunning,
    settings,
    startSession,
    pause,
    resume,
    complete,
    cancel,
    refreshSession,
    refreshSettings: loadSettings,
    progress,
    totalTime,
  };
};
