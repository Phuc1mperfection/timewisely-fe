import { createContext } from "react";
import type { NotificationResponse, NotificationStatus } from "@/interfaces";


export interface NotificationContextType {
  // State
  notifications: NotificationResponse[];
  unreadCount: number;
  isConnected: boolean;
  isLoading: boolean;
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  getNotificationsByStatus: (
    status: NotificationStatus
  ) => NotificationResponse[];
}


export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
