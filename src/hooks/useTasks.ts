import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  type Task,
  type CreateTaskRequest,
  type UpdateTaskRequest,
  type TaskFilters,
} from "@/services/taskServices";
import { useToast } from "./useToast";

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();

  // Serialize filters to avoid object reference changes causing re-renders
  const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } catch (err) {
      const errorMessage = "Failed to load tasks";
      setError(errorMessage);
      toastError(errorMessage);
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]); 

  // Create task
  const addTask = useCallback(
    async (taskData: CreateTaskRequest): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      try {
        const newTask = await createTask(taskData);
        setTasks((prev) => [newTask, ...prev]);
        toastSuccess("Task created successfully");
        return newTask;
      } catch (err) {
        const errorMessage = "Failed to create task";
        setError(errorMessage);
        toastError(errorMessage);
        console.error("Failed to create task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Update task
  const modifyTask = useCallback(
    async (
      taskId: number,
      updates: UpdateTaskRequest
    ): Promise<Task | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedTask = await updateTask(taskId, updates);
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        toastSuccess("Task updated successfully");
        return updatedTask;
      } catch (err) {
        const errorMessage = "Failed to update task";
        setError(errorMessage);
        toastError(errorMessage);
        console.error("Failed to update task:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Delete task
  const removeTask = useCallback(
    async (taskId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        toastSuccess("Task deleted successfully");
        return true;
      } catch (err) {
        const errorMessage = "Failed to delete task";
        setError(errorMessage);
        toastError(errorMessage);
        console.error("Failed to delete task:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Toggle completion
  const toggleCompletion = useCallback(
    async (taskId: number): Promise<boolean> => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        )
      );

      try {
        const updatedTask = await toggleTaskCompletion(taskId);
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return true;
      } catch (err) {
        // Revert optimistic update
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          )
        );

        const errorMessage = "Failed to toggle task completion";
        setError(errorMessage);
        toastError(errorMessage);
        console.error("Failed to toggle task completion:", err);
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );



  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    modifyTask,
    removeTask,
    toggleCompletion,
  };
}
