import apiClient from "./apiClient";
import { AxiosError } from "axios";

// ========== Types ==========

export interface PomodoroSession {
  id: number;
  userId: string;
  taskId?: string;
  taskName?: string;
  status: "RUNNING" | "PAUSED" | "COMPLETED" | "CANCELLED";
  sessionType: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  duration: number; // in minutes
  startTime: string;
  endTime?: string;
  pauseTime?: string;
  totalPauseDuration?: number; // in seconds
  remainingTime: number; // in seconds
  completedAt?: string;
  cancelledAt?: string;
}

export interface StartPomodoroRequest {
  taskId?: string;
  sessionType?: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK"; // Optional: defaults to FOCUS in backend
  duration?: number; // Optional: custom duration in minutes for micro-tasks (< 1 pomodoro)
}

export interface PomodoroStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalFocusTime: number; // in minutes
  averageSessionDuration: number; // in minutes
  completionRate: number; // percentage
  sessionsToday: number;
  sessionsThisWeek: number;
  streakDays: number;
}

export interface UserSettings {
  completedFocusCount: number;
  id: number;
  userId: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export interface UpdateUserSettingsRequest {
  focusDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  longBreakInterval?: number;
  autoStartBreaks?: boolean;
  autoStartPomodoros?: boolean;
  soundEnabled?: boolean;
}

export interface NextSessionSuggestion {
  suggestedType: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  suggestedTaskId?: number;
  suggestedTaskName?: string;
  reason: string;
  completedSessionsCount: number;
}

// ========== API Functions ==========

/**
 * Start a new Pomodoro session
 */
export const startPomodoroSession = async (
  request: StartPomodoroRequest
): Promise<PomodoroSession> => {
  const response = await apiClient.post<PomodoroSession>(
    "/pomodoro/sessions",
    request
  );
  return response.data;
};

/**
 * Get the active Pomodoro session
 */
export const getActiveSession = async (): Promise<PomodoroSession | null> => {
  try {
    const response = await apiClient.get<PomodoroSession>(
      "/pomodoro/sessions/active"
    );
    return response.data;
  } catch (error) {
    // Return null if no active session (404)
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Pause the current session
 */
export const pauseSession = async (
  sessionId: number
): Promise<PomodoroSession> => {
  const response = await apiClient.patch<PomodoroSession>(
    `/pomodoro/sessions/${sessionId}/pause`
  );
  return response.data;
};

/**
 * Resume a paused session
 */
export const resumeSession = async (
  sessionId: number
): Promise<PomodoroSession> => {
  const response = await apiClient.patch<PomodoroSession>(
    `/pomodoro/sessions/${sessionId}/resume`
  );
  return response.data;
};

/**
 * Complete the current session
 */
export const completeSession = async (
  sessionId: number
): Promise<PomodoroSession> => {
  const response = await apiClient.patch<PomodoroSession>(
    `/pomodoro/sessions/${sessionId}/complete`
  );
  return response.data;
};

/**
 * Cancel the current session
 */
export const cancelSession = async (
  sessionId: number
): Promise<PomodoroSession> => {
  const response = await apiClient.patch<PomodoroSession>(
    `/pomodoro/sessions/${sessionId}/cancel`
  );
  return response.data;
};

/**
 * Get session history
 */
export const getSessionHistory = async (
  limit: number = 50
): Promise<PomodoroSession[]> => {
  const response = await apiClient.get<PomodoroSession[]>(
    "/pomodoro/sessions/history",
    {
      params: { limit },
    }
  );
  return response.data;
};

/**
 * Get Pomodoro statistics
 */
export const getPomodoroStats = async (
  startDate?: string,
  endDate?: string
): Promise<PomodoroStats> => {
  const response = await apiClient.get<PomodoroStats>("/pomodoro/stats", {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Get user settings
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  const response = await apiClient.get<UserSettings>("/pomodoro/settings");
  return response.data;
};

/**
 * Update user settings
 */
export const updateUserSettings = async (
  settings: UpdateUserSettingsRequest
): Promise<UserSettings> => {
  const response = await apiClient.put<UserSettings>(
    "/pomodoro/settings",
    settings
  );
  return response.data;
};

/**
 * Get next session suggestion
 */
export const getNextSessionSuggestion =
  async (): Promise<NextSessionSuggestion> => {
    const response = await apiClient.get<NextSessionSuggestion>(
      "/pomodoro/suggestions/next-session"
    );
    return response.data;
  };

/**
 * Reset focus count to start a new cycle
 */
export const resetFocusCount = async (): Promise<UserSettings> => {
  const response = await apiClient.patch<UserSettings>(
    "/pomodoro/settings/reset-focus-count"
  );
  return response.data;
};

// ========== Export all ==========
export default {
  startPomodoroSession,
  getActiveSession,
  pauseSession,
  resumeSession,
  completeSession,
  cancelSession,
  getSessionHistory,
  getPomodoroStats,
  getUserSettings,
  updateUserSettings,
  getNextSessionSuggestion,
  resetFocusCount,
};
