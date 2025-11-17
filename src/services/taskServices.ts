import apiClient from "./apiClient";
import type {Task, TaskFormData } from "@/interfaces";

// Backend type mapping helpers
const mapTypeToBackend = (type: string): string => {
  const mapping: Record<string, string> = {
    pomodoro: "POMODORO_ONLY",
    todo: "TODO_ONLY",
    both: "BOTH",
  };
  return mapping[type] || type.toUpperCase();
};

const mapPriorityToBackend = (priority: string): string => {
  return priority.toUpperCase();
};

const mapCategoryToBackend = (category: string): string => {
  return category.toUpperCase();
};

const mapTaskFromBackend = (task: any): Task => ({
  id: task.id?.toString() || "",
  name: task.name || "",
  description: task.description || "",
  type: task.type?.toLowerCase().replace("_only", "") || "todo",
  estimatedPomodoros: task.estimatedPomodoros || 0,
  completedPomodoros: task.completedPomodoros || 0,
  priority: task.priority?.toLowerCase() || "medium",
  category: task.category?.toLowerCase() || "other",
  dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
  completed: task.isCompleted || false,
  createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
});

// Get all tasks for current user
export const getTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get("/tasks");
  return response.data.map(mapTaskFromBackend);
};

// Get single task by ID
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get(`/tasks/${id}`);
  return mapTaskFromBackend(response.data);
};

// Create new task
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const response = await apiClient.post("/tasks", {
    name: taskData.name,
    description: taskData.description,
    type: mapTypeToBackend(taskData.type),
    estimatedPomodoros: taskData.estimatedPomodoros,
    priority: mapPriorityToBackend(taskData.priority),
    category: mapCategoryToBackend(taskData.category),
    dueDate: taskData.dueDate.toISOString(),
  });
  return mapTaskFromBackend(response.data);
};

// Update existing task
export const updateTask = async (
  id: string,
  taskData: Partial<TaskFormData>
): Promise<Task> => {
  const payload: any = {};

  if (taskData.name !== undefined) payload.name = taskData.name;
  if (taskData.description !== undefined)
    payload.description = taskData.description;
  if (taskData.type !== undefined)
    payload.type = mapTypeToBackend(taskData.type);
  if (taskData.estimatedPomodoros !== undefined)
    payload.estimatedPomodoros = taskData.estimatedPomodoros;
  if (taskData.priority !== undefined)
    payload.priority = mapPriorityToBackend(taskData.priority);
  if (taskData.category !== undefined)
    payload.category = mapCategoryToBackend(taskData.category);
  if (taskData.dueDate !== undefined)
    payload.dueDate = taskData.dueDate.toISOString();

  const response = await apiClient.put(`/tasks/${id}`, payload);
  return mapTaskFromBackend(response.data);
};

// Toggle task completion status
export const toggleTaskComplete = async (id: string): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${id}/toggle-complete`);
  return mapTaskFromBackend(response.data);
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

// Toggle favorite status
export const toggleTaskFavorite = async (id: string): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${id}/toggle-favorite`);
  return mapTaskFromBackend(response.data);
};
