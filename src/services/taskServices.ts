import apiClient from "./apiClient";

// ========== Types ==========

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW" | "URGENT";
export type TaskCategory =
  | "WORK"
  | "PERSONAL"
  | "STUDY"
  | "HEALTH"
  | "SHOPPING"
  | "LEARNING"
  | "SOCIAL"
  | "OTHER";
export type TaskType = "TODO_ONLY" | "POMODORO_ONLY" | "BOTH";

export interface Task {
  id: number;
  name: string;
  description?: string;
  isCompleted: boolean;
  estimatedPomodoros: number; 
  completedPomodoros: number; 
  dueDate?: string;
  priority: TaskPriority;
  category: TaskCategory;
  type: TaskType;
  isFavorite: boolean;
  activityId?: string; // UUID of related calendar activity
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  progressPercentage: number;
  isOverdue: boolean;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  estimatedPomodoros?: number;
  dueDate?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  type?: TaskType;
  activityId?: string; // Link to calendar activity
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  estimatedPomodoros?: number;
  dueDate?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  type?: TaskType;
  isCompleted?: boolean;
  isFavorite?: boolean;
  activityId?: string; // Link to calendar activity
}

export interface TaskFilters {
  type?: TaskType;
  completed?: boolean;
  category?: TaskCategory;
  dueDate?: string;
}

/**
 * Get all tasks with optional filters
 */
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>("/tasks", {
    params: filters,
  });
  return response.data;
};

/**
 * Get a specific task by ID
 */
export const getTaskById = async (taskId: number): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Create a new task
 */
export const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  const response = await apiClient.post<Task>("/tasks", task);
  return response.data;
};

/**
 * Update an existing task
 */
export const updateTask = async (
  taskId: number,
  updates: UpdateTaskRequest
): Promise<Task> => {
  const response = await apiClient.put<Task>(`/tasks/${taskId}`, updates);
  return response.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: number): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};

/**
 * Toggle task completion status
 */
export const toggleTaskCompletion = async (taskId: number): Promise<Task> => {
  const response = await apiClient.patch<Task>(
    `/tasks/${taskId}/toggle-completion`
  );
  return response.data;
};


// ========== Export all ==========
export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
};
