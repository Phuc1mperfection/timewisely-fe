import type { Task, TaskFormData } from "@/interfaces";

// Interface segregation for task operations
export interface TaskReader {
  getTasks(): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
}

export interface TaskWriter {
  createTask(taskData: TaskFormData): Promise<Task>;
  updateTask(id: string, taskData: Partial<TaskFormData>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

export interface TaskStateManager {
  toggleComplete(id: string): Promise<void>;
}

// Combined interface for full task management
export interface TaskService extends TaskReader, TaskWriter, TaskStateManager {}

// Component-specific interfaces
export interface TaskListOperations {
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export interface TaskFormOperations {
  onSubmit: (taskData: TaskFormData) => void;
  onCancel: () => void;
}
