import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export const NotificationBell: React.FC = () => {
  const { unreadCount, isConnected } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          <span
            className={cn(
              "absolute bottom-0 right-0 size-2 rounded-full",
              isConnected ? "bg-green-500" : "bg-gray-400"
            )}
            title={isConnected ? "Connected" : "Disconnected"}
          />

          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[380px] max-h-[600px] p-0">
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
