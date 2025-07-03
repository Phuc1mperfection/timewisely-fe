import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CustomActivityCard } from "@/components/dashboard/CustomActivityCard";
import ActivityPopover from "@/components/dashboard/ActivityPopover";
import YearView from "./YearView";
import React, { useMemo, useCallback } from "react";
import { CustomToolbar } from "@/components/dashboard/CustomToolbar";
import type { Activity } from "@/interfaces/Activity";
import type { EventProps, ToolbarProps } from "react-big-calendar";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
const formats = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dayFormat: (date: Date, culture: string | undefined, localizer: any) => {
    const day = localizer.format(date, "DD", culture);
    const weekday = localizer.format(date, "ddd", culture);
    return `${day}\n${weekday}`;
  },
};
interface ScheduleCalendarProps {
  events: Activity[];
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  onSelectEvent: (activity: object) => void;
  onEventDrop: (args: {
    event: object;
    start: Date | string;
    end: Date | string;
  }) => void;
  onEventResize: (args: {
    event: object;
    start: Date | string;
    end: Date | string;
  }) => void;
  eventStyleGetter: (activity: object) => { style: React.CSSProperties };
  views?: View[];
  view?: View;
  onView?: (view: View) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
onEventDelete?: (activityId: string) => void;
  className?: string;
}

export function ScheduleCalendar({
  events,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  onEventResize,
  eventStyleGetter,
  view,
  onView,
  date,
  onNavigate,
  onEventDelete,
  className = "",
}: ScheduleCalendarProps) {
  // Memoize custom views
  const customViews = useMemo(
    () => ({
      month: true,
      week: true,
      day: true,
      agenda: true,
      year: YearView,
    }),
    []
  );

  // Memoize event component
  const eventComponent = useCallback(
    (props: EventProps<object>) => {
      const activity = props.event as Activity;
      const legacyEvent = {
        ...activity,
        start: activity.startTime,
        end: activity.endTime,
      };

      return (
        <ActivityPopover
          onOpenEditDialog={() => onSelectEvent?.(activity)}
        onDelete={() => {
  onEventDelete?.(activity.id);
}}
        >
          <CustomActivityCard activity={legacyEvent} />
        </ActivityPopover>
      );
    },
    [onSelectEvent, onEventDelete]
  );

  // Memoize toolbar component
  const toolbarComponent = useCallback(
    (toolbarProps: ToolbarProps) => (
      <CustomToolbar
        label={toolbarProps.label}
        onNavigate={toolbarProps.onNavigate}
        onView={toolbarProps.onView}
        views={Object.keys(customViews)}
        view={toolbarProps.view}
      />
    ),
    [customViews]
  );

  return (
    <DragAndDropCalendar
      className={className}
      localizer={localizer}
      events={events}
      startAccessor={(activity) => (activity as Activity).startTime}
      endAccessor={(activity) => (activity as Activity).endTime}
      onSelectSlot={onSelectSlot}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      selectable
      resizable
      draggableAccessor={() => true}
      eventPropGetter={eventStyleGetter}
      views={customViews}
      view={view}
      onView={onView}
      date={date}
      onNavigate={onNavigate}
      style={{ height: "100%" }}
      popup
      showMultiDayTimes
      step={30}
      timeslots={2}
      messages={{
        month: "Month",
        week: "Week",
        day: "Day",
        agenda: "Agenda",
        today: "Today",
        previous: "Previous",
        next: "Next",
        allDay: "All Day",
        date: "Date",
        time: "Time",
      }}
      formats={formats}
      components={{
        event: eventComponent,
        toolbar: toolbarComponent,
      }}
    />
  );
}
