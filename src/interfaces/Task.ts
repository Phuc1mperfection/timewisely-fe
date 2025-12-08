export type TaskType = "TODO_ONLY" | "POMODORO_ONLY" | "BOTH";
export type TaskContext = "pomodoro" | "todo"; // For UI context
export type Priority = "low" | "medium" | "high" | "urgent";
export type Category =
  | "work"
  | "personal"
  | "study"
  | "fitness"
  | "health"
  | "shopping"
  | "learning"
  | "social"
  | "other";

export interface Task {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: Priority;
  category: Category;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  order: number;
}

export interface TaskFilters {
  type?: TaskType;
  priority?: Priority;
  category?: Category;
  completed?: boolean;
  search?: string;
}

export type SortOption = "dueDate" | "priority" | "createdAt" | "name";
export type SortOrder = "asc" | "desc";

export interface TaskFormData {
  name: string;
  description: string;
  type: TaskType;
  estimatedPomodoros: number;
  priority: Priority;
  category: Category;
  dueDate: Date;
  order?: number;
}
