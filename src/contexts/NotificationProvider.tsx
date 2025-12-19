import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { NotificationMessage, NotificationResponse } from "@/interfaces";
import { NotificationStatus, NotificationChannel } from "@/interfaces";
import { NotificationApiService } from "@/services/notificationServices";
import { webSocketService } from "@/services/webSocketService";
import { loadNotificationSettings } from "@/services/notificationSettings";
import { soundService } from "@/services/soundService";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import {
  NotificationContext,
  type NotificationContextType,
} from "./NotificationContextTypes";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const calculateUnreadCount = useCallback(
    (notificationList: NotificationResponse[]) => {
      return notificationList.filter(
        (notif) => notif.status === NotificationStatus.SENT
      ).length;
    },
    []
  );

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const notificationData = await NotificationApiService.getNotifications(
        50
      );

      setNotifications(notificationData);
      setUnreadCount(calculateUnreadCount(notificationData));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateUnreadCount]);

  const handleNewNotification = useCallback(
    (message: NotificationMessage) => {
      const newNotification: NotificationResponse = {
        id: message.notificationId,
        userId: user?.id || "",
        type: message.type,
        title: message.title,
        message: message.message,
        targetType: message.targetType,
        targetId: message.targetId,
        channel: NotificationChannel.WEBSOCKET,
        status: NotificationStatus.SENT,
        sentAt: new Date(message.timestamp).toISOString(),
      };

      const settings = loadNotificationSettings();
      const typeMapping = {
        TASK_REMINDER: "taskReminder",
        ACTIVITY_REMINDER: "activityReminder",
        OVERDUE_ALERT: "overdueAlert",
        MORNING_DIGEST: "morningDigest",
      } as const;

      const settingKey = typeMapping[message.type as keyof typeof typeMapping];
      if (settingKey && !settings.reminders[settingKey]) {
        return;
      }

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast.info(message.title, {
        description: message.message,
        duration: 4000,
      });

      if (settings.browser.enabled && Notification.permission === "granted") {
        new Notification(message.title, {
          body: message.message,
          icon: "/favicon.ico",
          tag: message.notificationId,
        });
      }

      // Play notification sound if enabled
      if (soundService.getSettings().enabled) {
        soundService.playNotification();
      }
    },
    [user]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await NotificationApiService.markAsRead(notificationId);

        setNotifications((prev) => {
          const updatedNotifications = prev.map((notif) =>
            notif.id === notificationId
              ? {
                  ...notif,
                  status: NotificationStatus.READ,
                  readAt: new Date().toISOString(),
                }
              : notif
          );

          setUnreadCount(calculateUnreadCount(updatedNotifications));
          return updatedNotifications;
        });
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [calculateUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationApiService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          status: NotificationStatus.READ,
          readAt: notif.readAt || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await NotificationApiService.deleteNotification(notificationId);

        // Update local state
        setNotifications((prev) => {
          const newNotifications = prev.filter(
            (notif) => notif.id !== notificationId
          );
          // Recalculate unread count from remaining notifications
          setUnreadCount(calculateUnreadCount(newNotifications));
          return newNotifications;
        });
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    },
    [calculateUnreadCount]
  );

  const deleteAllNotifications = useCallback(async () => {
    try {
      await NotificationApiService.deleteAllNotifications();

      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  }, []);

  const getNotificationsByStatus = useCallback(
    (status: NotificationStatus): NotificationResponse[] => {
      return notifications.filter((notif) => notif.status === status);
    },
    [notifications]
  );

  useEffect(() => {
    // Đợi AuthProvider load xong đã
    if (authLoading) {
      return;
    }

    // Nếu không có user => disconnect & clear state
    if (!user?.id) {
      webSocketService.disconnect();
      setIsConnected(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Có user rồi: xin quyền browser notification
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }

    // Lấy notifications từ API
    fetchNotifications();

    // Kết nối WebSocket
    webSocketService.connect(handleNewNotification, (connected) => {
      setIsConnected(connected);
    });

    // Cleanup khi user đổi hoặc unmount
    return () => {
      webSocketService.disconnect();
      setIsConnected(false);
    };
  }, [user?.id, authLoading, fetchNotifications, handleNewNotification]);

  const contextValue = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      isConnected,
      isLoading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      getNotificationsByStatus,
    }),
    [
      notifications,
      unreadCount,
      isConnected,
      isLoading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      deleteAllNotifications,
      getNotificationsByStatus,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
