import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CustomEventCard } from "@/components/dashboard/CustomEventCard";
import EventWrapper from "@/components/dashboard/EventWrapper";
import YearView from "./YearView";
import React, { useMemo } from "react";
import { CustomToolbar } from "@/components/dashboard/CustomToolbar";
import type { UserActivity } from "@/hooks/useUserActivities";
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

interface ScheduleCalendarProps {
  events: UserActivity[];
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
  // Controlled view and date
  view?: View;
  onView?: (view: View) => void;
  date?: Date;
  onNavigate?: (date: Date) => void;
  onEventDelete?: (event: UserActivity) => void; // <-- Add this prop
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
  // Custom views object with YearView
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

  return (
    <DragAndDropCalendar
      className={className}
      localizer={localizer}
      events={events}
      startAccessor={(activity) => (activity as UserActivity).start}
      endAccessor={(activity) => (activity as UserActivity).end}
      onSelectSlot={onSelectSlot}
      onSelectEvent={onSelectEvent}
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
      components={{
        event: (props) => (
          <EventWrapper
            onDelete={() => onEventDelete?.(props.event as UserActivity)}
          >
            <CustomEventCard event={props.event as UserActivity} />
          </EventWrapper>
        ),
        toolbar: (toolbarProps) => (
          <CustomToolbar
            label={toolbarProps.label}
            onNavigate={toolbarProps.onNavigate}
            onView={toolbarProps.onView}
            views={Object.keys(customViews)}
            view={toolbarProps.view}
          />
        ),
      }}
    />
  );
}
