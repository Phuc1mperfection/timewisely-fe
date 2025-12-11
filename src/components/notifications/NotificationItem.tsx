import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  Trash2,
} from "lucide-react";
import type {
  NotificationResponse,
  NotificationType,
  TargetType,
} from "@/interfaces";
import { NotificationStatus } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationItemProps {
  notification: NotificationResponse;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "TASK_REMINDER":
      return <ListTodo className="size-5 text-blue-500" />;
    case "ACTIVITY_REMINDER":
      return <Calendar className="size-5 text-purple-500" />;
    case "OVERDUE_ALERT":
      return <Clock className="size-5 text-red-500" />;
    case "MORNING_DIGEST":
      return <Bell className="size-5 text-orange-500" />;
    default:
      return <Bell className="size-5 text-gray-500" />;
  }
};

const getNavigationPath = (
  targetType?: TargetType,
  targetId?: string
): string | null => {
  if (!targetType || !targetId) return null;

  switch (targetType) {
    case "TASK":
      return "/dashboard"; // Navigate to tasks dashboard
    case "ACTIVITY":
      return "/dashboard/calendar"; // Navigate to activities calendar
    default:
      return null;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();

  const isUnread = notification.status === NotificationStatus.SENT;
  const icon = getNotificationIcon(notification.type);
  const navigationPath = getNavigationPath(
    notification.targetType,
    notification.targetId
  );

  const handleClick = async () => {
    if (isUnread) {
      await markAsRead(notification.id);
    }

    if (navigationPath) {
      navigate(navigationPath);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent notification click
    await deleteNotification(notification.id);
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent notification click
    await markAsRead(notification.id);
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 border-b hover:bg-accent/50 transition-colors cursor-pointer group",
        isUnread && "bg-blue-50/50 dark:bg-blue-950/20"
      )}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn("text-sm font-medium", isUnread && "font-semibold")}
          >
            {notification.title}
          </h4>

          {isUnread && (
            <div className="flex-shrink-0 size-2 mt-1.5 bg-blue-500 rounded-full" />
          )}
        </div>  
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.sentAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <CheckCircle2 className="size-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
