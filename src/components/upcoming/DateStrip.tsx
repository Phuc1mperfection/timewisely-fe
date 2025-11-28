import { format, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useMemo, memo } from "react";

interface DateStripProps {
  days: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  compact?: boolean;
}

export const DateStrip = memo(function DateStrip({
  days,
  selectedDate,
  onDateSelect,
  compact = false,
}: DateStripProps) {
  const todayRef = useRef<HTMLButtonElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);
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

  // Auto-scroll to selected date when it changes (from page scroll)
  useEffect(() => {
    if (selectedRef.current && containerRef.current && !isToday(selectedDate)) {
      const container = containerRef.current;
      const selectedElement = selectedRef.current;
      const scrollLeft =
        selectedElement.offsetLeft -
        container.offsetWidth / 2 +
        selectedElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedDate]);

  // Only show first 30 days in date strip (performance optimization)
  const visibleDays = useMemo(() => days.slice(0, 30), [days]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-x-auto scrollbar-hide border-b border-border px-6 py-3 bg-background",
        compact ? "sticky top-0 z-20" : "sticky top-16 z-[9]"
      )}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex gap-2 min-w-max">
        {visibleDays.map((day) => {
          const isTodayDate = isToday(day);
          const isSelected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              ref={isTodayDate ? todayRef : isSelected ? selectedRef : null}
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
                  : isSelected
                  ? {
                      backgroundColor: "rgba(212, 175, 55, 0.15)",
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
});
