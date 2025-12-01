import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import type { Task, TaskFormData } from "@/interfaces";
import * as taskServices from "@/services/taskServices";

export function useTasks() {
  const { success, handleError } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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
      setTasks(sortedData);
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
      setTasks((prev) => {
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
      setTasks((prev) => {
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
      setTasks((prev) => {
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
      setTasks((prev) => prev.filter((task) => task.id !== id));
      success("Task deleted successfully!");
    } catch (err) {
      handleError(err, "Failed to delete task", "Delete Task");
    }
  };

  const updateTasksOrder = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
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
