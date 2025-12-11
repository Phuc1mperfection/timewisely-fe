import apiClient from "./apiClient";
import type { NotificationResponse, UpdateReminderRequest } from "@/interfaces";


export class NotificationApiService {
  static async getNotifications(
    limit: number = 50
  ): Promise<NotificationResponse[]> {
    const response = await apiClient.get("/notifications", {
      params: { limit },
    });
    return response.data;
  }


  static async getUnreadNotifications(): Promise<NotificationResponse[]> {
    const response = await apiClient.get("/notifications/unread");
    return response.data;
  }


  static async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      "/notifications/unread-count"
    );
    return response.data.count;
  }


  static async markAsRead(
    notificationId: string
  ): Promise<NotificationResponse> {
    const response = await apiClient.patch(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  }

  
  static async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  }

  
  static async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  static async deleteAllNotifications(): Promise<void> {
    await apiClient.delete("/notifications/all");
  }
}


export class TaskReminderApiService {
  static async updateTaskReminder(
    taskId: string,
    settings: UpdateReminderRequest
  ): Promise<void> {
    await apiClient.patch(`/tasks/${taskId}/reminder`, settings);
  }
}


export class ActivityReminderApiService {
  static async updateActivityReminder(
    activityId: string,
    settings: UpdateReminderRequest
  ): Promise<void> {
    await apiClient.patch(`/activities/${activityId}/reminder`, settings);
  }
}
