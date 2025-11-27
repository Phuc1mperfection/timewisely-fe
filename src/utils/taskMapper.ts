import type { Task, TaskFormData } from "@/interfaces";

// Backend response interface
export interface BackendTask {
  id?: string | number;
  name?: string;
  description?: string;
  type?: string;
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  priority?: string;
  category?: string;
  dueDate?: string | Date;
  isCompleted?: boolean;
  createdAt?: string | Date;
  order?: number;
}

// Task mapper utility class following SRP
export class TaskMapper {
  static mapTypeToBackend(type: string): string {
    const mapping: Record<string, string> = {
      pomodoro: "POMODORO_ONLY",
      todo: "TODO_ONLY",
      both: "BOTH",
    };
    return mapping[type] || type.toUpperCase();
  }

  static mapPriorityToBackend(priority: string): string {
    return priority.toUpperCase();
  }

  static mapCategoryToBackend(category: string): string {
    return category.toUpperCase();
  }

  static mapTaskFromBackend(task: BackendTask): Task {
    return {
      id: task.id?.toString() || "",
      name: task.name || "",
      description: task.description || "",
      type: (task.type?.toLowerCase().replace("_only", "") ||
        "todo") as Task["type"],
      estimatedPomodoros: task.estimatedPomodoros || 0,
      completedPomodoros: task.completedPomodoros || 0,
      priority: (task.priority?.toLowerCase() || "medium") as Task["priority"],
      category: (task.category?.toLowerCase() || "other") as Task["category"],
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      completed: task.isCompleted || false,
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
      order: task.order || 0,
    };
  }

  static mapTaskFormToBackend(taskData: TaskFormData): Record<string, unknown> {
    return {
      name: taskData.name,
      description: taskData.description,
      type: this.mapTypeToBackend(taskData.type),
      estimatedPomodoros: taskData.estimatedPomodoros,
      priority: this.mapPriorityToBackend(taskData.priority),
      category: this.mapCategoryToBackend(taskData.category),
      dueDate: taskData.dueDate.toISOString(),
    };
  }

  static mapPartialTaskFormToBackend(
    taskData: Partial<TaskFormData>
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (taskData.name !== undefined) payload.name = taskData.name;
    if (taskData.description !== undefined)
      payload.description = taskData.description;
    if (taskData.type !== undefined)
      payload.type = this.mapTypeToBackend(taskData.type);
    if (taskData.estimatedPomodoros !== undefined)
      payload.estimatedPomodoros = taskData.estimatedPomodoros;
    if (taskData.priority !== undefined)
      payload.priority = this.mapPriorityToBackend(taskData.priority);
    if (taskData.category !== undefined)
      payload.category = this.mapCategoryToBackend(taskData.category);
    if (taskData.dueDate !== undefined)
      payload.dueDate = taskData.dueDate.toISOString();
    if (taskData.order !== undefined) payload.order = taskData.order;

    return payload;
  }
}
