import apiClient from "./apiClient";
import type { Task, TaskFormData, UpdateReminderRequest } from "@/interfaces";
import { TaskMapper } from "@/utils/taskMapper";

// Task API service - handles only API communication
export class TaskApiService {
  static async getTasks(): Promise<Task[]> {
    const response = await apiClient.get("/tasks");
    return response.data.map(TaskMapper.mapTaskFromBackend);
  }

  static async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return TaskMapper.mapTaskFromBackend(response.data);
  }

  static async createTask(taskData: TaskFormData): Promise<Task> {
    const payload = TaskMapper.mapTaskFormToBackend(taskData);
    const response = await apiClient.post("/tasks", payload);
    return TaskMapper.mapTaskFromBackend(response.data);
  }

  static async updateTask(
    id: string,
    taskData: Partial<TaskFormData>
  ): Promise<Task> {
    const payload = TaskMapper.mapPartialTaskFormToBackend(taskData);
    const response = await apiClient.put(`/tasks/${id}`, payload);
    return TaskMapper.mapTaskFromBackend(response.data);
  }

  static async toggleTaskComplete(id: string): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/toggle-completion`);
    return TaskMapper.mapTaskFromBackend(response.data);
  }

  static async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  static async updateTaskOrder(
    taskOrders: Array<{ taskId: string; order: number }>
  ): Promise<void> {
    const payload = {
      taskOrders: taskOrders.map((item) => ({
        taskId: parseInt(item.taskId),
        order: item.order,
      })),
    };
    await apiClient.put("/tasks/order", payload);
  }

  static async updateTaskReminder(
    taskId: string,
    settings: UpdateReminderRequest
  ): Promise<Task> {
    const response = await apiClient.patch(
      `/tasks/${taskId}/reminder`,
      settings
    );
    return TaskMapper.mapTaskFromBackend(response.data);
  }
}

// Backward compatibility exports
export const getTasks = TaskApiService.getTasks;
export const getTaskById = TaskApiService.getTaskById;
export const createTask = TaskApiService.createTask;
export const updateTask = TaskApiService.updateTask;
export const toggleTaskComplete = TaskApiService.toggleTaskComplete;
export const deleteTask = TaskApiService.deleteTask;
export const updateTaskOrder = TaskApiService.updateTaskOrder;
export const updateTaskReminder = TaskApiService.updateTaskReminder;
