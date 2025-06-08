import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
interface UserActivity {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
}

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
}

export function ScheduleCalendar({
  events,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  onEventResize,
  eventStyleGetter,
  views = ["month", "week", "day", "agenda"],
  view,
  onView,
  date,
  onNavigate,
}: ScheduleCalendarProps) {
  return (
    <DragAndDropCalendar
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
      views={views}
      view={view}
      onView={onView}
      date={date}
      onNavigate={onNavigate}
      style={{ height: "100%" }}
      popup
      showMultiDayTimes
      step={30}
      timeslots={2}
    />
  );
}
