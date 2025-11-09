import React, { useState } from "react";
import { Plus, X, Check, Trash2, MoreVertical, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskEditDialog } from "./TaskEditDialog";
import type { Task } from "@/services/taskServices";
import type { UserSettings } from "@/services/pomodoroServices";

interface TaskSelectionCardProps {
  selectedSessionType: "FOCUS" | "SHORT_BREAK" | "LONG_BREAK";
  selectedTaskId: number | undefined;
  setSelectedTaskId: (id: number | undefined) => void;
  customTask: string;
  setCustomTask: (task: string) => void;
  tasks: Task[];
  loadingTasks: boolean;
  isAddingTask: boolean;
  setIsAddingTask: (adding: boolean) => void;
  newTaskName: string;
  setNewTaskName: (name: string) => void;
  newTaskEstPomodoros: number;
  setNewTaskEstPomodoros: (pomodoros: number) => void;
  isCreatingTask: boolean;
  settings: UserSettings | null;
  isLoading: boolean;
  currentSessionTaskId: number | undefined; // Task ID of active session (running or paused)
  onStart: () => void;
  onCreateTask: () => void;
  onCancelAddTask: () => void;
  onToggleTaskCompletion: (taskId: number) => void;
  onClearCompletedTasks: () => void;
  showCompletedTasks: boolean;
  onShowCompletedTasks: () => void;
  completedCount: number;
  onEditTask: (
    taskId: number,
    name: string,
    estimatedPomodoros: number
  ) => void;
  onDeleteTask: (taskId: number) => void;
  onCancelSession: () => void; // Cancel current session
}

export const TaskSelectionCard: React.FC<TaskSelectionCardProps> = ({
  selectedSessionType,
  selectedTaskId,
  setSelectedTaskId,
  customTask,
  setCustomTask,
  tasks,
  loadingTasks,
  isAddingTask,
  setIsAddingTask,
  newTaskName,
  setNewTaskName,
  newTaskEstPomodoros,
  setNewTaskEstPomodoros,
  isCreatingTask,
  settings,
  isLoading,
  currentSessionTaskId,
  onStart,
  onCreateTask,
  onCancelAddTask,
  onToggleTaskCompletion,
  onClearCompletedTasks,
  showCompletedTasks,
  onShowCompletedTasks,
  completedCount,
  onEditTask,
  onDeleteTask,
  onCancelSession,
}) => {
  // State for edit dialog
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handle task selection with confirmation if session exists (running or paused)
  const handleTaskSelection = (taskId: number) => {
    // If there's an active session (running or paused) and user is switching to a different task
    if (currentSessionTaskId && currentSessionTaskId !== taskId) {
      const confirmed = confirm(
        "The timer will be reset. Do you want to switch task?"
      );
      if (confirmed) {
        onCancelSession();
        setSelectedTaskId(taskId);
        setCustomTask("");
      }
    } else {
      // No active session or same task, just select
      setSelectedTaskId(taskId);
      setCustomTask("");
    }
  };

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1; // incomplete tasks (false) come first
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedSessionType === "FOCUS"
            ? "Task Selection"
            : "Break Session - No Task Required"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hide task selection for break sessions */}
        {selectedSessionType !== "FOCUS" ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {selectedSessionType === "SHORT_BREAK"
                ? "🍵 Take a 5-minute break to refresh"
                : "☕ Take a 15-minute break to recharge"}
            </p>
            <Button
              onClick={onStart}
              size="lg"
              disabled={isLoading}
              className="gap-2"
            >
              Start {selectedSessionType === "SHORT_BREAK" ? "Short" : "Long"}{" "}
              Break
            </Button>
          </div>
        ) : isAddingTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Create New Task</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelAddTask}
                disabled={isCreatingTask}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newTaskName">Task Name</Label>
                <Input
                  id="newTaskName"
                  placeholder="e.g., Complete project report"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onCreateTask();
                    } else if (e.key === "Escape") {
                      onCancelAddTask();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newTaskPomodoros">Estimated Pomodoros</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="newTaskPomodoros"
                    type="number"
                    min="0.1"
                    max="20"
                    step="0.1"
                    value={newTaskEstPomodoros}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value)) {
                        // Nếu gõ linh tinh (NaN) hoặc xóa hết, reset về 0.1
                        setNewTaskEstPomodoros(0.1);
                        return;
                      }

                      // Chỉ giới hạn min/max khi đang gõ, không làm tròn
                      setNewTaskEstPomodoros(
                        Math.min(Math.max(value, 0.1), 20)
                      );
                    }}
                    onBlur={(e) => {
                      // Đây là lúc áp dụng logic làm tròn của bạn
                      const value = parseFloat(e.target.value);
                      let finalValue;

                      if (isNaN(value) || value < 0.1) {
                        finalValue = 0.1;
                      } else if (value < 1) {
                        // YÊU CẦU 1: Dưới 1, là số thập phân (0.1-0.9)
                        finalValue = Math.round(value * 10) / 10;
                      } else {
                        // YÊU CẦU 2: Từ 1 trở lên, phải là số nguyên
                        finalValue = Math.round(value);
                      }

                      // Đảm bảo không vượt quá max sau khi làm tròn
                      setNewTaskEstPomodoros(Math.min(finalValue, 20));
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    (≈{" "}
                    {Math.round(
                      newTaskEstPomodoros * (settings?.focusDuration || 25)
                    )}{" "}
                    min)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={onCreateTask}
                  disabled={isCreatingTask || !newTaskName.trim()}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isCreatingTask ? "Creating..." : "Create Task"}
                </Button>
                <Button
                  onClick={onCancelAddTask}
                  disabled={isCreatingTask}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Task List */}
            {loadingTasks ? (
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Select a task to focus on
                  </Label>
                  <div className="flex items-center gap-2">
                    {completedCount > 0 && !showCompletedTasks && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShowCompletedTasks}
                        className="text-muted-foreground"
                      >
                        Show {completedCount} completed
                      </Button>
                    )}
                    {completedCount > 0 && showCompletedTasks && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearCompletedTasks}
                        className="text-muted-foreground"
                      >
                        Hide completed
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingTask(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2">
                    {sortedTasks.map((task) => {
                      const estimatedPomodoros = task.estimatedPomodoros || 1;
                      const completedPomodoros = task.completedPomodoros || 0;
                      const percentage =
                        (completedPomodoros / estimatedPomodoros) * 100;

                      return (
                        <div
                          key={task.id}
                          className={`flex items-start gap-2 p-3 rounded-md border transition-colors ${
                            selectedTaskId === task.id
                              ? "bg-primary-60 text-primary border-primary"
                              : task.isCompleted
                              ? "bg-muted/50 border-muted"
                              : "bg-background border-input hover:bg-accent"
                          } ${task.isCompleted ? "opacity-60" : ""}`}
                        >
                          {/* Checkbox */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTaskCompletion(task.id);
                            }}
                            className="cursor-pointer mt-1"
                          >
                            <Checkbox
                              checked={task.isCompleted}
                              className="pointer-events-none"
                            />
                          </div>

                          {/* Task Content - Clickable */}
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              if (!task.isCompleted) {
                                handleTaskSelection(task.id);
                              }
                            }}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className={`font-medium text-base ${
                                    task.isCompleted ? "line-through" : ""
                                  }`}
                                >
                                  {task.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      selectedTaskId === task.id
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="font-mono text-xs"
                                  >
                                    🍅 {Math.round(completedPomodoros)}/
                                    {Math.round(estimatedPomodoros)}
                                  </Badge>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <Progress
                                value={Math.min(percentage, 100)}
                                className="h-1.5"
                              />

                              {task.description && (
                                <span className="text-xs text-muted-foreground line-clamp-2">
                                  {task.description}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* More Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(task);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete task "${task.name}"?`)) {
                                    onDeleteTask(task.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No tasks yet. Create your first task!
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingTask(true)}
                      className="border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Custom Task Input */}
            <div className="space-y-2">
              <Label>Enter custom task name</Label>
              <Input
                placeholder="e.g., Study for exam, Write report..."
                value={customTask}
                onChange={(e) => {
                  setCustomTask(e.target.value);
                  if (e.target.value) {
                    setSelectedTaskId(undefined);
                  }
                }}
              />
            </div>
          </>
        )}
      </CardContent>

      {/* Edit Task Dialog */}
      <TaskEditDialog
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={onEditTask}
        settings={settings}
      />
    </Card>
  );
};
