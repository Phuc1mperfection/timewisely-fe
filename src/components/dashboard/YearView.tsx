import React from "react";
import { Button } from "@/components/ui/button";
import type { Event } from "react-big-calendar";

type YearViewProps = {
  date: Date;
  localizer: {
    format: (date: Date, formatStr: string) => string;
    add: (date: Date, amount: number, unit: string) => Date;
    startOf: (date: Date, unit: string) => Date;
    endOf: (date: Date, unit: string) => Date;
    lte: (date: Date, b: Date, unit: string) => boolean;
  };
  events?: Event[];
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent?: (event: Event) => void;
  [key: string]: unknown;
};

class YearView extends React.Component<YearViewProps> {
  static range(
    date: Date,
    { localizer }: { localizer: YearViewProps["localizer"] }
  ) {
    const start = localizer.startOf(date, "year");
    const end = localizer.endOf(date, "year");
    let current = start;
    const range = [];
    while (localizer.lte(current, end, "day")) {
      range.push(current);
      current = localizer.add(current, 1, "day");
    }
    return range;
  }

  static navigate(
    date: Date,
    action: string,
    { localizer }: { localizer: YearViewProps["localizer"] }
  ) {
    switch (action) {
      case "PREV":
        return localizer.add(date, -1, "year");
      case "NEXT":
        return localizer.add(date, 1, "year");
      default:
        return date;
    }
  }

  static title(
    date: Date,
    { localizer }: { localizer: YearViewProps["localizer"] }
  ) {
    return localizer.format(date, "YYYY");
  }

  createMonthCalendar(monthDate: Date) {
    const { localizer } = this.props;
    const first = localizer.startOf(monthDate, "month");
    const last = localizer.endOf(monthDate, "month");

    const firstDayOfWeek = first.getDay();
    const daysInMonth = localizer.lte(first, last, "day")
      ? last.getDate() - first.getDate() + 1
      : last.getDate();
    const weeksCount = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

    const calendar = [];
    for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
      const week = [];
      for (let day = 0; day < 7; day++) {
        const offset = weekNumber * 7 + day - firstDayOfWeek;
        const date = localizer.add(first, offset, "day");
        week.push({
          date,
          isCurrentMonth: date.getMonth() === monthDate.getMonth(),
          isToday:
            date.toDateString() === new Date().toDateString() ? "today" : "",
        });
      }
      calendar.push(week);
    }
    return { calendar, month: monthDate };
  }

  getEventsForDate(date: Date) {
    const { events = [], localizer } = this.props;
    return events.filter((event) =>
      localizer.lte(
        localizer.startOf(event.start!, "day"),
        localizer.startOf(date, "day"),
        "day"
      ) &&
      localizer.lte(
        localizer.startOf(date, "day"),
        localizer.startOf(event.end!, "day"),
        "day"
      )
    );
  }

  render() {
    const { date, localizer, onSelectSlot, onSelectEvent } = this.props;
    const rows: React.ReactNode[][] = [[], [], []];
    const firstMonth = localizer.startOf(date, "year");

    for (let i = 0; i < 12; i++) {
      const monthDate = localizer.add(firstMonth, i, "month");
      const { calendar } = this.createMonthCalendar(monthDate);
      const monthBlock = (
        <div
          key={i}
          className="flex-1 max-w-[220px] mx-1 mb-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="text-sm font-bold text-center text-purple-600 mb-1">
            {localizer.format(monthDate, "MMMM")}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            <div className="grid grid-cols-7 gap-0.5 col-span-7">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold text-gray-600 h-[24px] leading-[24px]"
                >
                  {day}
                </span>
              ))}
            </div>
            {calendar.map((week, weekIndex) =>
              week.map(({ date, isCurrentMonth, isToday }, dayIndex) => {
                const events = this.getEventsForDate(date);
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="relative"
                    onClick={() =>
                      isCurrentMonth &&
                      onSelectSlot?.({
                        start: localizer.startOf(date, "day"),
                        end: localizer.endOf(date, "day"),
                      })
                    }
                  >
                    <Button
                      disabled={!isCurrentMonth}
                      variant={isToday ? "default" : "ghost"}
                      size="sm"
                      className={`w-[24px] h-[24px] rounded-full text-xs mx-auto ${
                        isCurrentMonth
                          ? "text-gray-800 bg-white hover:bg-purple-500 hover:text-yellow-100"
                          : "text-gray-500 bg-gray-100 cursor-not-allowed"
                      } ${isToday ? "bg-purple-500 text-yellow-100" : ""}`}
                    >
                      {date.getDate()}
                    </Button>
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className="absolute top-0 left-0 w-full h-[4px] rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent?.(event);
                        }}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
      rows[Math.floor(i / 4)].push(monthBlock);
    }

    return (
      <div className="w-full h-full flex flex-col p-3 bg-gray-50 overflow-y-auto">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="flex w-full justify-center gap-2 mb-3"
          >
            {row}
          </div>
        ))}
      </div>
    );
  }
}

export default YearView;