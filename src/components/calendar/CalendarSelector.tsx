import React, { useState, useEffect } from "react";
import { getCalendars } from "@/services/calendarServices";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CalendarSelectorProps {
  selectedCalendarId: string; // Giữ lại để tương thích với code cũ
  onCalendarChange: (calendarId: string) => void; // Giữ lại để tương thích với code cũ
  className?: string;
  // Thêm props mới cho việc chọn nhiều calendar
  selectedCalendarIds?: string[];
  onCalendarsChange?: (calendarIds: string[]) => void;
}

interface CalendarItem {
  id: string;
  summary: string;
  primary?: boolean;
  colorId?: string;
  backgroundColor?: string;
}

export const CalendarSelector: React.FC<CalendarSelectorProps> = ({
  selectedCalendarId,
  onCalendarChange,
  className,
  selectedCalendarIds = [],
  onCalendarsChange,
}) => {
  const [calendars, setCalendars] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  // State nội bộ để theo dõi các calendar được chọn
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCalendarIds);

  // Các màu mặc định cho calendars
  const colorMap: Record<string, string> = {
    "1": "#9FC5E8", // Xanh dương nhạt
    "2": "#B6D7A8", // Xanh lá nhạt
    "3": "#FFD966", // Vàng
    "4": "#F4CCCC", // Đỏ nhạt
    "5": "#D5A6BD", // Tím nhạt
    "6": "#A4C2F4", // Xanh dương
    "7": "#A2C4C9", // Xanh lục
    "8": "#FFB347", // Cam
    "9": "#D7B5A6", // Nâu nhạt
    "10": "#B4A7D6", // Tím
  };

  // Fetch available calendars when component mounts
  useEffect(() => {
    const loadCalendars = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching calendar list...");
        const response = await getCalendars();
        console.log("Calendar list response:", response);

        if (response?.items?.length) {
          // Enhance calendars with background colors based on colorId
          const enhancedCalendars = response.items.map((cal) => ({
            ...cal,
            backgroundColor: cal.colorId
              ? colorMap[cal.colorId] || "#9FC5E8"
              : "#9FC5E8",
          }));

          setCalendars(enhancedCalendars);

          // Nếu không có calendar nào được chọn, chọn tất cả calendar
          if (selectedIds.length === 0) {
            const allIds = enhancedCalendars.map((cal) => cal.id);
            setSelectedIds(allIds);

            // Gọi callback để cập nhật parent component
            if (onCalendarsChange) {
              onCalendarsChange(allIds);
            }

            // Compatibility với API cũ, chọn calendar chính hoặc calendar đầu tiên
            if (!selectedCalendarId) {
              const primaryCal = enhancedCalendars.find((cal) => cal.primary);
              if (primaryCal && onCalendarChange) {
                onCalendarChange(primaryCal.id);
              } else if (enhancedCalendars.length > 0 && onCalendarChange) {
                onCalendarChange(enhancedCalendars[0].id);
              }
            }
          }
        } else {
          console.log("No calendars found or empty response");
        }
      } catch (err) {
        console.error("Error fetching calendars:", err);
        setError("Failed to load calendars");
      } finally {
        setLoading(false);
      }
    };

    loadCalendars();
  }, [

  ]);

  // Hàm xử lý khi checkbox được thay đổi
  const handleCalendarToggle = (calendarId: string) => {
    // Kiểm tra calendar đã được chọn chưa
    const isSelected = selectedIds.includes(calendarId);
    let newSelectedIds: string[];

    if (isSelected) {
      // Nếu đã chọn, bỏ chọn nó
      newSelectedIds = selectedIds.filter((id) => id !== calendarId);
    } else {
      // Nếu chưa chọn, thêm vào danh sách đã chọn
      newSelectedIds = [...selectedIds, calendarId];
    }

    // Cập nhật state
    setSelectedIds(newSelectedIds);

    // Gọi callback để cập nhật parent component
    if (onCalendarsChange) {
      onCalendarsChange(newSelectedIds);
    }

    // Tương thích với API cũ
    // Nếu calendar này được chọn và là calendar duy nhất được chọn, chọn nó làm calendar hiện tại
    if (!isSelected && newSelectedIds.length === 1 && onCalendarChange) {
      onCalendarChange(calendarId);
    }
    // Nếu calendar này đang là calendar hiện tại và bị bỏ chọn, chọn calendar đầu tiên trong danh sách
    else if (
      isSelected &&
      calendarId === selectedCalendarId &&
      newSelectedIds.length > 0 &&
      onCalendarChange
    ) {
      onCalendarChange(newSelectedIds[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader size={16} className="animate-spin" />
        <span>Loading calendars...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!calendars.length) {
    return <div className="text-muted-foreground">No calendars found</div>;
  }

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full border rounded-md shadow-sm bg-card"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-3 rounded-t-md"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">Calendars</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedIds.length} selected
              </span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 opacity-50" />
              ) : (
                <ChevronDown className="h-4 w-4 opacity-50" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2 space-y-1 border-t">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={`calendar-${calendar.id}`}
                checked={selectedIds.includes(calendar.id)}
                onCheckedChange={() => handleCalendarToggle(calendar.id)}
              />
              <div
                className="flex items-center gap-2 w-full cursor-pointer"
                onClick={() => handleCalendarToggle(calendar.id)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: calendar.backgroundColor }}
                />
                <label
                  htmlFor={`calendar-${calendar.id}`}
                  className="cursor-pointer text-sm"
                >
                  {calendar.summary} {calendar.primary ? "(Primary)" : ""}
                </label>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CalendarSelector;
