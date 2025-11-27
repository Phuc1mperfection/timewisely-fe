import { format, isToday, isTomorrow } from "date-fns";

interface DayHeaderProps {
  date: Date;
}

export function DayHeader({ date }: DayHeaderProps) {
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
