import React, { useState } from "react";
import { CheckCheck, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationStatus } from "@/interfaces";

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAllAsRead,
    deleteAllNotifications,
    getNotificationsByStatus,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const unreadNotifications = getNotificationsByStatus(NotificationStatus.SENT);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <h3 className="text-lg font-semibold">Notifications</h3>

        {/* Header actions */}
        <div className="flex items-center gap-1">
          {/* Mark all as read */}
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <CheckCheck className="size-4" />
            </Button>
          )}

          {/* Clear all */}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={deleteAllNotifications}
              title="Clear all notifications"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "unread")}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b px-4">
          <TabsTrigger value="all" className="relative">
            All
            {notifications.length > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({notifications.length})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All notifications tab */}
        <TabsContent value="all" className="flex-1 m-0">
          <div className="h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <Settings className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Unread notifications tab */}
        <TabsContent value="unread" className="flex-1 m-0">
          <div className="h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <CheckCheck className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            ) : (
              <div>
                {unreadNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
