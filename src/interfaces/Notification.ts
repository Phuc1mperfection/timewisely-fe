
export const NotificationType = {
  TASK_REMINDER: "TASK_REMINDER",
  ACTIVITY_REMINDER: "ACTIVITY_REMINDER",
  OVERDUE_ALERT: "OVERDUE_ALERT",
  MORNING_DIGEST: "MORNING_DIGEST",
} as const;
export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const TargetType = {
  TASK: "TASK",
  ACTIVITY: "ACTIVITY",
} as const;
export type TargetType = (typeof TargetType)[keyof typeof TargetType];

export const NotificationChannel = {
  WEBSOCKET: "WEBSOCKET",
  EMAIL: "EMAIL",
  IN_APP: "IN_APP",
} as const;
export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const NotificationStatus = {
  SENT: "SENT",
  FAILED: "FAILED",
  READ: "READ",
} as const;
export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface NotificationMessage {
  notificationId: string; // UUID as string
  type: NotificationType;
  title: string;
  message: string;
  targetType?: TargetType;
  targetId?: string;
  timestamp: number;
}

export interface NotificationResponse {
  id: string; // UUID as string
  userId: string; // UUID as string
  type: NotificationType;
  title: string;
  message: string;
  targetType?: TargetType;
  targetId?: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt: string; // ISO 8601 datetime string
  readAt?: string; // ISO 8601 datetime string
}

export interface UpdateReminderRequest {
  reminderEnabled: boolean;
  reminderMinutesBefore?: number;
}
