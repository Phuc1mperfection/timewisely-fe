import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { usePomodoroSession } from "@/hooks/usePomodoroSession";
import { useTasks } from "@/hooks/useTasks";
import {
  updateUserSettings,
  getNextSessionSuggestion,
  resetFocusCount,
} from "@/services/pomodoroServices";
import type { StartPomodoroRequest } from "@/services/pomodoroServices";
import { PomodoroHeader } from "@/components/pomodoro/PomodoroHeader";
import { PomodoroTimerCard } from "@/components/pomodoro/PomodoroTimerCard";
import { TaskSelectionCard } from "@/components/pomodoro/TaskSelectionCard";
import { PomodoroCounter } from "@/components/pomodoro/PomodoroCounter";

const PomodoroPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>(
    undefined
  );
  const [customTask, setCustomTask] = useState<string>("");
  const [selectedSessionType, setSelectedSessionType] = useState<
    "FOCUS" | "SHORT_BREAK" | "LONG_BREAK"
  >("FOCUS");

  // Add task form state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskEstPomodoros, setNewTaskEstPomodoros] = useState<number>(1);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // State to show/hide completed tasks
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  // Load all tasks (both completed and incomplete)
  const {
    tasks: allTasks,
    loading: loadingTasks,
    fetchTasks,
    addTask,
    modifyTask,
    removeTask,
    toggleCompletion,
  } = useTasks({
    // No filter - load all tasks
  });

  // Filter tasks based on showCompletedTasks state
  const tasks = showCompletedTasks
    ? allTasks
    : allTasks.filter((task) => !task.isCompleted);

  const {
    session,
    timeLeft,
    isRunning,
    settings,
    isLoading,
    startSession,
    pause,
    resume,
    complete,
    cancel,
    totalTime,
    refreshSettings,
  } = usePomodoroSession({
    onSessionComplete: async (completedSession) => {
      // Auto-switch based on completed session type
      if (completedSession.sessionType === "FOCUS") {
        // After completing Focus → get suggestion for next session type
        await fetchTasks(); // Refresh task list to show updated pomodoro count
        await refreshSettings(); // Refresh settings to update pomodoro counter

        try {
          const suggestion = await getNextSessionSuggestion();

          setTimeout(() => {
            setSelectedSessionType(suggestion.suggestedType);

            if (suggestion.suggestedType === "LONG_BREAK") {
              info("Great job! Time for a long break! 🌟☕");
            } else {
              info("Great job! Time for a short break! ☕");
            }
          }, 100);
        } catch (err) {
          console.error("Failed to get session suggestion:", err);
          // Fallback to short break if API fails
          setTimeout(() => {
            setSelectedSessionType("SHORT_BREAK");
            info("Great job! Time for a break! ☕");
          }, 100);
        }
      } else if (
        completedSession.sessionType === "SHORT_BREAK" ||
        completedSession.sessionType === "LONG_BREAK"
      ) {
        // After completing Break → switch back to Focus
        setTimeout(() => {
          setSelectedSessionType("FOCUS");
          info("Break is over! Ready to focus? 🍅");
        }, 100);
      }
    },
  });

  // Settings dialog state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Statistics dialog state
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const [tempDurations, setTempDurations] = useState({
    pomodoro: settings?.focusDuration || 25, // stored in MINUTES
    shortBreak: settings?.shortBreakDuration || 5, // stored in MINUTES
    longBreak: settings?.longBreakDuration || 15, // stored in MINUTES
  });

  // Sync temp durations when settings change
  useEffect(() => {
    if (settings) {
      setTempDurations({
        pomodoro: settings.focusDuration, // backend returns MINUTES
        shortBreak: settings.shortBreakDuration,
        longBreak: settings.longBreakDuration,
      });
    }
  }, [settings]);

  // Sync selectedTaskId and selectedSessionType from active session on mount/session change
  useEffect(() => {
    if (session) {
      // Sync session type
      setSelectedSessionType(session.sessionType);

      // Sync task selection
      if (session.taskId) {
        setSelectedTaskId(session.taskId);
        setCustomTask(""); // Clear custom task if session has a taskId
      } else if (session.taskName) {
        setCustomTask(session.taskName);
        setSelectedTaskId(undefined); // Clear selected task if using custom name
      }
    }
  }, [session]);

  // Refresh settings when tab becomes visible (after F5 or tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSettings(); // Refresh when user comes back to tab
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshSettings]);

  // Compute display time based on active session or selected tab
  const getDisplayTimeLeft = (): number => {
    // If there's an active session, use its timeLeft
    if (session) {
      return timeLeft;
    }

    // Otherwise, use settings based on selected tab
    if (!settings) return 0;

    // For FOCUS sessions, check if selected task is a micro-task
    if (selectedSessionType === "FOCUS" && selectedTaskId) {
      const selectedTask = tasks.find((t) => t.id === selectedTaskId);
      if (
        selectedTask &&
        selectedTask.estimatedPomodoros &&
        selectedTask.estimatedPomodoros < 1
      ) {
        const customDuration = Math.round(
          selectedTask.estimatedPomodoros * settings.focusDuration
        );
        return customDuration * 60; // Convert minutes to seconds
      }
    }

    switch (selectedSessionType) {
      case "FOCUS":
        return settings.focusDuration * 60; // Convert minutes to seconds
      case "SHORT_BREAK":
        return settings.shortBreakDuration * 60;
      case "LONG_BREAK":
        return settings.longBreakDuration * 60;
      default:
        return 0;
    }
  };

  const displayTimeLeft = getDisplayTimeLeft();

  // Display total time should match display time left when no session
  const displayTotalTime = session ? totalTime : displayTimeLeft;

  const getCurrentTask = () => {
    // If there's an active session, use its task name
    if (session?.taskName) {
      return session.taskName;
    }

    // If a task is selected, get its name from the tasks list
    if (selectedTaskId) {
      const selectedTask = tasks.find((t) => t.id === selectedTaskId);
      if (selectedTask) {
        return selectedTask.name;
      }
    }

    // If custom task is entered, use it
    if (customTask) {
      return customTask;
    }

    // Default fallback
    return "";
  };

  // Handle creating new task
  const handleCreateTask = async () => {
    if (!newTaskName.trim()) {
      error("Please enter a task name");
      return;
    }

    if (newTaskEstPomodoros < 0.1) {
      error("Estimated pomodoros must be at least 0.1");
      return;
    }

    if (newTaskEstPomodoros > 20) {
      error("Estimated pomodoros cannot exceed 20");
      return;
    }

    try {
      setIsCreatingTask(true);
      const newTask = await addTask({
        name: newTaskName.trim(),
        estimatedPomodoros: newTaskEstPomodoros,
        type: "BOTH", // Can be used in both Pomodoro and Todo
      });

      if (newTask) {
        success(`Task "${newTask.name}" created successfully! 🎉`);
        // Auto-select the new task
        setSelectedTaskId(newTask.id);
        setCustomTask("");
        // Reset form
        setNewTaskName("");
        setNewTaskEstPomodoros(1);
        setIsAddingTask(false);
        // Refresh task list
        await fetchTasks();
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleCancelAddTask = () => {
    setNewTaskName("");
    setNewTaskEstPomodoros(1);
    setIsAddingTask(false);
  };

  // Handle toggling task completion
  const handleToggleTaskCompletion = async (taskId: number) => {
    await toggleCompletion(taskId);
  };

  // Handle editing task
  const handleEditTask = async (
    taskId: number,
    name: string,
    estimatedPomodoros: number
  ) => {
    try {
      await modifyTask(taskId, { name, estimatedPomodoros });
      await fetchTasks();
      // Toast already handled in modifyTask hook
    } catch (error) {
      // Error handled in modifyTask hook
      console.error("Failed to edit task:", error);
    }
  };

  // Handle deleting task
  const handleDeleteTask = async (taskId: number) => {
    try {
      // If deleting the currently selected task, clear selection
      if (selectedTaskId === taskId) {
        setSelectedTaskId(undefined);
      }

      // If there's an active session using this task, cancel it
      if (session && session.taskId === taskId) {
        await cancel(); // Cancel the session first
        info("Session cancelled because the task was deleted");
      }

      await removeTask(taskId);
      // Toast already handled in removeTask hook
    } catch (error) {
      // Error handled in removeTask hook
      console.error("Failed to delete task:", error);
    }
  };

  // Handle clearing all completed tasks (hide them, not delete)
  const handleClearCompletedTasks = () => {
    setShowCompletedTasks(false);
    info("Completed tasks hidden");
  };

  // Handle showing completed tasks
  const handleShowCompletedTasks = () => {
    setShowCompletedTasks(true);
    info("Showing all tasks");
  };

  // Handle saving settings
  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);

      await updateUserSettings({
        focusDuration: tempDurations.pomodoro,
        shortBreakDuration: tempDurations.shortBreak,
        longBreakDuration: tempDurations.longBreak,
      });

      success("Settings saved successfully! ⚙️");

      // Refresh settings from API
      await refreshSettings();

      setIsSettingsOpen(false);
    } catch (err) {
      error("Failed to save settings");
      console.error("Failed to save settings:", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle resetting pomodoro count
  const handleResetFocusCount = async () => {
    try {
      await resetFocusCount();
      await refreshSettings(); // Refresh to get updated count
      success("Pomodoro count reset! Starting fresh 🍅");
    } catch (err) {
      error("Failed to reset count");
      console.error("Failed to reset count:", err);
    }
  };

  const handleStart = async () => {
    // For break sessions, no task required
    if (
      selectedSessionType === "SHORT_BREAK" ||
      selectedSessionType === "LONG_BREAK"
    ) {
      const request: StartPomodoroRequest = {
        sessionType: selectedSessionType,
      };
      await startSession(request);
      return;
    }

    // For focus sessions, task is required
    if (!selectedTaskId && !customTask) {
      error("Please select or enter a task to focus on.");
      return;
    }

    // Calculate custom duration for micro-tasks (< 1 pomodoro)
    let customDuration: number | undefined = undefined;
    if (selectedTaskId) {
      const selectedTask = tasks.find((t) => t.id === selectedTaskId);
      if (
        selectedTask &&
        selectedTask.estimatedPomodoros &&
        selectedTask.estimatedPomodoros < 1
      ) {
        // Micro-task: calculate proportional duration
        const focusDuration = settings?.focusDuration || 25;
        customDuration = Math.round(
          selectedTask.estimatedPomodoros * focusDuration
        );
        info(`Starting micro-task session: ${customDuration} minutes ⏱️`);
      }
    }

    const request: StartPomodoroRequest = {
      taskId: selectedTaskId,
      sessionType: "FOCUS",
      duration: customDuration,
    };

    await startSession(request);
  };

  const handlePause = async () => {
    if (isRunning) {
      await pause();
    } else if (session?.status === "PAUSED") {
      await resume();
    }
  };

  const handleStop = async () => {
    await cancel();

    // Reset to initial state after canceling
    setSelectedTaskId(undefined);
    setCustomTask("");
    await fetchTasks(); // Refresh tasks to update any changes
  };

  const handleSkip = async () => {
    const sessionType = session?.sessionType;

    try {
      await complete();

      // Auto-switch based on session type
      if (sessionType === "FOCUS") {
        // After skipping Focus → get suggestion for next session type
        await fetchTasks(); // Refresh task list to show updated pomodoro count
        await refreshSettings(); // Refresh settings to update pomodoro counter

        try {
          const suggestion = await getNextSessionSuggestion();

          setTimeout(() => {
            setSelectedSessionType(suggestion.suggestedType);

            if (suggestion.suggestedType === "LONG_BREAK") {
              info("Session skipped! Time for a long break! 🌟☕");
            } else {
              info("Session skipped! Time for a short break! ☕");
            }
          }, 100);
        } catch (err) {
          console.error("Failed to get session suggestion:", err);
          // Fallback to short break if API fails
          setTimeout(() => {
            setSelectedSessionType("SHORT_BREAK");
            info("Great job! Time for a break! ☕");
          }, 100);
        }
      } else if (
        sessionType === "SHORT_BREAK" ||
        sessionType === "LONG_BREAK"
      ) {
        // After skipping Break → switch back to Focus
        setTimeout(() => {
          setSelectedSessionType("FOCUS");
          info("Break skipped! Ready to focus? 🍅");
        }, 100);
      }
    } catch (err) {
      console.error("Failed to complete session:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with Settings and Stats */}
        <PomodoroHeader
          settings={settings}
          isStatsOpen={isStatsOpen}
          setIsStatsOpen={setIsStatsOpen}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          tempDurations={tempDurations}
          setTempDurations={setTempDurations}
          isSavingSettings={isSavingSettings}
          onSaveSettings={handleSaveSettings}
        />

        {/* Pomodoro Counter */}
        <div className="mt-6 max-w-md mx-auto">
          <PomodoroCounter
            settings={settings}
            onResetCount={handleResetFocusCount}
          />
        </div>

        {/* Grid Layout: Timer Card and Task Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Timer Card */}
          <PomodoroTimerCard
            session={session}
            selectedSessionType={selectedSessionType}
            setSelectedSessionType={setSelectedSessionType}
            displayTimeLeft={displayTimeLeft}
            displayTotalTime={displayTotalTime}
            isRunning={isRunning}
            isLoading={isLoading}
            selectedTaskId={selectedTaskId}
            customTask={customTask}
            tasks={tasks}
            getCurrentTask={getCurrentTask}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onSkip={handleSkip}
          />

          {/* Task Selection */}
          <TaskSelectionCard
            selectedSessionType={selectedSessionType}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            customTask={customTask}
            setCustomTask={setCustomTask}
            tasks={tasks}
            loadingTasks={loadingTasks}
            isAddingTask={isAddingTask}
            setIsAddingTask={setIsAddingTask}
            newTaskName={newTaskName}
            setNewTaskName={setNewTaskName}
            newTaskEstPomodoros={newTaskEstPomodoros}
            setNewTaskEstPomodoros={setNewTaskEstPomodoros}
            isCreatingTask={isCreatingTask}
            settings={settings}
            isLoading={isLoading}
            currentSessionTaskId={session?.taskId}
            onStart={handleStart}
            onCreateTask={handleCreateTask}
            onCancelAddTask={handleCancelAddTask}
            onToggleTaskCompletion={handleToggleTaskCompletion}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onClearCompletedTasks={handleClearCompletedTasks}
            showCompletedTasks={showCompletedTasks}
            onShowCompletedTasks={handleShowCompletedTasks}
            completedCount={allTasks.filter((t) => t.isCompleted).length}
            onCancelSession={handleStop}
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
