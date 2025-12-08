import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/useToast";
import type { Task, TaskFormData } from "@/interfaces";
import * as taskServices from "@/services/taskServices";

type TaskFilterContext = "pomodoro" | "todo" | "all";

export function useTasks(filterContext: TaskFilterContext = "all") {
  const { success, handleError } = useToast();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter tasks based on context
  const tasks = useMemo(() => {
    if (filterContext === "all") return allTasks;

    if (filterContext === "pomodoro") {
      return allTasks.filter(
        (t) => t.type === "POMODORO_ONLY" || t.type === "BOTH"
      );
    }

    // filterContext === "todo"
    return allTasks.filter((t) => t.type === "TODO_ONLY" || t.type === "BOTH");
  }, [allTasks, filterContext]);

  // Helper function to sort tasks by order
  const sortTasks = (tasks: Task[]) => {
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskServices.getTasks();
      // Sort tasks by order
      const sortedData = sortTasks(data);
      setAllTasks(sortedData);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      // Simple error handling without toast to avoid dependency issues
    } finally {
      setLoading(false);
    }
  }, []); // Empty deps to prevent infinite loop

  const createTask = async (taskData: TaskFormData) => {
    try {
      const newTask = await taskServices.createTask(taskData);
      setAllTasks((prev) => {
        const updated = [newTask, ...prev];
        // Sort after adding
        return sortTasks(updated);
      });
      success("Task created successfully!");
      return newTask;
    } catch (err) {
      handleError(err, "Failed to create task", "Create Task");
      return null;
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const updatedTask = await taskServices.toggleTaskComplete(id);
      setAllTasks((prev) => {
        const updated = prev.map((task) =>
          task.id === id ? updatedTask : task
        );
        // Sort after updating
        return sortTasks(updated);
      });
      success(
        updatedTask.completed
          ? "Task marked as complete!"
          : "Task marked as incomplete!"
      );
    } catch (err) {
      handleError(err, "Failed to update task status", "Toggle Task Complete");
    }
  };

  const updateTask = async (id: string, taskData: Partial<TaskFormData>) => {
    try {
      const updatedTask = await taskServices.updateTask(id, taskData);
      setAllTasks((prev) => {
        const updated = prev.map((task) =>
          task.id === id ? updatedTask : task
        );
        // Sort after updating
        return sortTasks(updated);
      });
      success("Task updated successfully!");
      return updatedTask;
    } catch (err) {
      handleError(err, "Failed to update task", "Update Task");
      return null;
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount to prevent infinite loop

  const deleteTask = async (id: string) => {
    try {
      await taskServices.deleteTask(id);
      setAllTasks((prev) => prev.filter((task) => task.id !== id));
      success("Task deleted successfully!");
    } catch (err) {
      handleError(err, "Failed to delete task", "Delete Task");
    }
  };

  const updateTasksOrder = useCallback((reorderedTasks: Task[]) => {
    setAllTasks(reorderedTasks);
  }, []);

  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    updateTasksOrder,
  };
}
