import { format, isToday, isTomorrow } from "date-fns";

interface DayHeaderProps {
  date: Date | null;
  isOverdueSection?: boolean;
}

export function DayHeader({ date, isOverdueSection = false }: DayHeaderProps) {
  if (isOverdueSection) {
    return (
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
        Overdue
      </h2>
    );
  }

  if (!date) return null;

  const dayNumber = format(date, "d");
  const month = format(date, "MMM");
  const weekday = format(date, "EEEE");

  let dayLabel = "";
  if (isToday(date)) {
    dayLabel = "Today";
  } else if (isTomorrow(date)) {
    dayLabel = "Tomorrow";
  }

  return (
    <h2 className="text-xl font-bold text-foreground">
      {dayNumber} {month}
      {dayLabel && (
        <>
          {" · "}
          <span className="text-muted-foreground font-semibold">
            {dayLabel}
          </span>
        </>
      )}
      {" · "}
      <span className="text-muted-foreground font-normal">{weekday}</span>
    </h2>
  );
}
