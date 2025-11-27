import { format, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface DateStripProps {
  days: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateStrip({
  days,
  selectedDate,
  onDateSelect,
}: DateStripProps) {
  const todayRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to today on mount
    if (todayRef.current && containerRef.current) {
      const container = containerRef.current;
      const todayElement = todayRef.current;
      const scrollLeft =
        todayElement.offsetLeft -
        container.offsetWidth / 2 +
        todayElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto scrollbar-hide border-b border-border px-6 py-3"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex gap-2 min-w-max">
        {days.map((day) => {
          const isTodayDate = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              ref={isTodayDate ? todayRef : null}
              onClick={() => onDateSelect(day)}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-2 rounded-md transition-colors",
                "hover:bg-accent",
                isSelected && "bg-accent"
              )}
              style={
                isTodayDate
                  ? {
                      backgroundColor: "rgba(212, 175, 55, 0.1)",
                      color: "var(--wisely-gold)",
                    }
                  : {}
              }
            >
              <span className="text-xs font-medium text-muted-foreground">
                {format(day, "EEE")}
              </span>
              <span
                className={cn("text-sm font-semibold mt-1")}
                style={isTodayDate ? { color: "var(--wisely-gold)" } : {}}
              >
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
