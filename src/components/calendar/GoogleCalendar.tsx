/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from "react";
import { Views } from "react-big-calendar";
// moment not needed in this file (ScheduleCalendar provides localization)
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  // syncCalendarEvents removed as it's no longer needed
} from "@/services/calendarServices";
// CalendarEvent type intentionally not imported — we normalize responses ourselves
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/useAuth";
import { Loader, Plus, AlertCircle } from "lucide-react"; // Added AlertCircle
import { CustomToolbar } from "@/components/dashboard/CustomToolbar";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import type { View } from "react-big-calendar";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";
import ConnectGoogleButton from "./ConnectGoogleButton";
import CalendarSelector from "./CalendarSelector"; // Import CalendarSelector
// localizer is provided by ScheduleCalendar

interface TransformedEvent {
  id?: string; // Make id optional to match EventData in CalendarEventModal
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  colorId?: string;
  calendarId?: string;
  calendarName?: string;
  allDay?: boolean;
  originalEvent?: unknown; // Changed from CalendarEvent to unknown to match EventData
}

// Backend event format (from EventDto)
// BackendEvent interface not required here

const GoogleCalendar: React.FC = () => {
  const [events, setEvents] = useState<TransformedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>(
    localStorage.getItem("userEmail") || ""
  );
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TransformedEvent | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { user } = useAuth();
  const { success, error } = useToast();

  // Helpers for RFC3339 local datetime without 'Z' and user's timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const toLocalRFC3339 = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      "T" +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  };

  // Controlled view/date for react-big-calendar (so external controls work)
  const [view, setView] = useState<View>(Views.WEEK as View);
  const [date, setDate] = useState<Date>(new Date());

  const getLabel = (v: View, d: Date) => {
    try {
      if (v === Views.MONTH) return format(d, "MMMM yyyy");
      if (v === Views.WEEK) {
        const start = startOfWeek(d, { weekStartsOn: 1 });
        const end = endOfWeek(d, { weekStartsOn: 1 });
        return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
      }
      if (v === Views.DAY) return format(d, "PPP");
      return format(d, "MMM yyyy");
    } catch (e) {
      console.error("Error formatting label:", e);
      return "";
    }
  };

  const handleNavigate = (action: string) => {
    if (action === "TODAY") {
      setDate(new Date());
      return;
    }
    if (action === "PREV") {
      if (view === Views.MONTH) setDate((d) => addMonths(d, -1));
      else if (view === Views.WEEK) setDate((d) => addWeeks(d, -1));
      else if (view === Views.DAY) setDate((d) => addDays(d, -1));
      else setDate((d) => addMonths(d, -1));
      return;
    }
    if (action === "NEXT") {
      if (view === Views.MONTH) setDate((d) => addMonths(d, 1));
      else if (view === Views.WEEK) setDate((d) => addWeeks(d, 1));
      else if (view === Views.DAY) setDate((d) => addDays(d, 1));
      else setDate((d) => addMonths(d, 1));
      return;
    }
  };

  // Kiểm tra xem người dùng đăng nhập bằng Google (OAuth) hay không
  const isGoogleUser =
    user?.googleConnected ||
    user?.googleCalendarSynced ||
    (user?.email && user?.email.includes("@gmail.com"));
  // Fetch events helper — calls backend service and normalizes results
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await getAllEvents({ maxResults: 250 });

      // Normalize different backend shapes: either an array or { items: [...] }
      const items: any[] = Array.isArray(res) ? res : res?.items || [];

      const transformedEvents: TransformedEvent[] = items
        .filter((ev) => {
          return (
            ev &&
            (ev.id || ev.eventId) &&
            (ev.summary || ev.title) &&
            ((ev.start && (ev.start.dateTime || ev.startDateTime)) ||
              ev.startDateTime ||
              ev.start)
          );
        })
        .map((ev) => {
          // Support both Google-style and backend DTO fields
          const startStr = ev.start?.dateTime || ev.startDateTime || ev.start;
          const endStr = ev.end?.dateTime || ev.endDateTime || ev.end;
          const startDate = startStr ? new Date(startStr) : new Date();
          const endDate = endStr
            ? new Date(endStr)
            : new Date(startDate.getTime() + 60 * 60 * 1000);

          // Determine all-day: Google all-day events use start.date (no time)
          const isDateOnly = Boolean(ev.start && ev.start.date);
          const isExplicitAllDay = Boolean(
            ev.isAllDay || ev.isAllDayEvent || ev.allDay
          );

          // Multi-day heuristic: duration >= 24h and both times at midnight
          const durationMs = endDate.getTime() - startDate.getTime();
          const isMultiDay = durationMs >= 24 * 60 * 60 * 1000;
          const startIsMidnight =
            startDate.getHours() === 0 &&
            startDate.getMinutes() === 0 &&
            startDate.getSeconds() === 0;
          const endIsMidnight =
            endDate.getHours() === 0 &&
            endDate.getMinutes() === 0 &&
            endDate.getSeconds() === 0;

          const allDay =
            isDateOnly ||
            isExplicitAllDay ||
            (isMultiDay && startIsMidnight && endIsMidnight);

          return {
            id: ev.id || ev.eventId || "",
            title: ev.summary || ev.title || "",
            start: startDate,
            end: endDate,
            description: ev.description,
            location: ev.location,
            colorId: ev.colorId,
            calendarId: ev.calendarId,
            calendarName: ev.calendarName,
            allDay,
            originalEvent: ev,
          } as TransformedEvent;
        });

      setEvents(transformedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      let errorMessage = "Failed to load calendar events";
      if (err instanceof Error) errorMessage = err.message || errorMessage;
      setApiError(errorMessage);
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [error, setApiError, selectedCalendarIds]);

  // Anti-infinite-loop protection
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Skip sync step since it doesn't exist in backend
  const syncAndFetchEvents = useCallback(async () => {
    try {
      if (fetchAttempted) {
        return;
      }

      setLoading(true);
      setFetchAttempted(true);
      console.log("Fetching calendar events directly (no sync needed)");

      // Just fetch events directly - no sync needed
      await fetchEvents();
    } catch (err) {
      console.error("Error fetching calendar events:", err);
      error("Failed to load calendar events");
      setLoading(false);
    }
  }, [fetchEvents, error, fetchAttempted]);

  useEffect(() => {
    // Only fetch events if user has connected their Google Calendar
    if (isGoogleUser) {
      syncAndFetchEvents();
    } else {
      setLoading(false);
    }
  }, [syncAndFetchEvents, isGoogleUser, selectedCalendarId]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setSelectedEvent({
        id: "",
        start,
        end,
        title: "",
        description: "",
        originalEvent: {
          id: "",
          summary: "",
          start: { dateTime: toLocalRFC3339(start), timeZone },
          end: { dateTime: toLocalRFC3339(end), timeZone },
        },
      });
      setModalMode("create");
      setModalOpen(true);
    },
    []
  );

  // (handlers moved to ActivityDialog onSave/onDelete usage)

  // Sử dụng biến isGoogleUser đã tạo ở trên để kiểm tra trạng thái kết nối
  if (!isGoogleUser) {
    return <ConnectGoogleButton onConnect={fetchEvents} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <button
          onClick={() =>
            handleSelectSlot({
              start: new Date(),
              end: new Date(Date.now() + 60 * 60 * 1000),
            })
          }
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span>New Event</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <div className="w-80">
            <CalendarSelector
              selectedCalendarId={selectedCalendarId}
              onCalendarChange={(calendarId) => {
                console.log(
                  `Calendar selection changed from "${selectedCalendarId}" to "${calendarId}"`
                );
                setSelectedCalendarId(calendarId);
              }}
              selectedCalendarIds={selectedCalendarIds}
              onCalendarsChange={(calendarIds) => {
                console.log(
                  `Selected calendars changed to: [${calendarIds.join(", ")}]`
                );
                setSelectedCalendarIds(calendarIds);
                // Refetch events when selected calendars change
                setTimeout(() => fetchEvents(), 100); // Small delay to ensure state is updated
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <CustomToolbar
              label={getLabel(view, date)}
              onNavigate={(action) => handleNavigate(action as any)}
              onView={(v) => setView(v as View)}
              views={["month", "week", "day", "agenda"]}
              view={view}
            />
            <button
              onClick={fetchEvents}
              className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Refresh Events
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <Loader className="w-10 h-10 animate-spin yellow-500" />
        </div>
      ) : events.length > 0 ? (
        // Adapter: map TransformedEvent -> Activity and reuse ScheduleCalendar
        <ScheduleCalendar
          events={events.map((ev) => ({
            id: ev.id || "",
            title: ev.title,
            startTime: ev.start,
            endTime: ev.end,
            description: ev.description,
            color: ev.colorId || "#D4AF37",
            allDay: ev.allDay || false,
            location: ev.location,
            type: "google",
          }))}
          onSelectSlot={({ start, end }) => handleSelectSlot({ start, end })}
          onSelectEvent={(activity: any) => {
            const act = activity as any;
            setSelectedEvent({
              id: act.id,
              title: act.title,
              description: act.description,
              start: act.startTime,
              end: act.endTime,
              location: act.location,
              colorId: act.color,
              originalEvent: undefined,
            });
            setModalMode("edit");
            setModalOpen(true);
          }}
          onEventDrop={async ({ event, start, end }) => {
            const ev = event as any;
            if (!ev?.id) {
              error("Cannot move event: missing ID");
              return;
            }
            try {
              const formattedEvent: any = {
                summary: ev.title,
                description: ev.description,
                start: { dateTime: toLocalRFC3339(new Date(start)), timeZone },
                end: { dateTime: toLocalRFC3339(new Date(end)), timeZone },
                location: ev.location,
              };
              await updateEvent(ev.id, formattedEvent);
              success("Event moved");
              await fetchEvents();
            } catch (err) {
              console.error("Failed to move event:", err);
              error("Failed to move event");
            }
          }}
          onEventResize={async ({ event, start, end }) => {
            const ev = event as any;
            if (!ev?.id) {
              error("Cannot resize event: missing ID");
              return;
            }
            try {
              const formattedEvent: any = {
                summary: ev.title,
                description: ev.description,
                start: { dateTime: toLocalRFC3339(new Date(start)), timeZone },
                end: { dateTime: toLocalRFC3339(new Date(end)), timeZone },
                location: ev.location,
              };
              await updateEvent(ev.id, formattedEvent);
              success("Event resized");
              await fetchEvents();
            } catch (err) {
              console.error("Failed to resize event:", err);
              error("Failed to resize event");
            }
          }}
          eventStyleGetter={(activity: any) => {
            const color = (activity && activity.color) || "#FFD966";
            return {
              style: {
                backgroundColor: color,
                borderRadius: "4px",
                opacity: 0.8,
                border: "0px",
                color: "#000",
              },
            };
          }}
          view={view}
          onView={(v) => setView(v as View)}
          date={date}
          onNavigate={(d) => setDate(new Date(d))}
          onEventDelete={async (activityId: string) => {
            try {
              await deleteEvent(activityId);
              success("Event deleted successfully");
              await fetchEvents();
            } catch (err) {
              console.error("Failed to delete event:", err);
              error("Failed to delete event");
            }
          }}
          className="modern-calendar"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-[600px] bg-white/5  rounded-xl p-4 ">
          <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No Calendar Events Found
          </h3>

          {apiError ? (
            <div className="bg-red-500/20 text-white p-3 rounded-md mb-4 max-w-md text-center">
              <p className="font-bold">Error:</p>
              <p>{apiError}</p>
            </div>
          ) : (
            <p className="text-center text-white/70 max-w-md mb-4">
              No events were found for your calendar. Try creating a new event.
            </p>
          )}
        </div>
      )}

      {modalOpen && (
        <ActivityDialog
          isOpen={modalOpen}
          // For create mode use timeSlot, for edit mode pass event
          event={
            modalMode === "edit" && selectedEvent
              ? {
                  // Map TransformedEvent -> Activity-like shape
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                  color: selectedEvent.colorId || "#D4AF37",
                  allDay: selectedEvent.allDay || false,
                  startTime: selectedEvent.start,
                  endTime: selectedEvent.end,
                  location: selectedEvent.location,
                }
              : undefined
          }
          timeSlot={
            modalMode === "create" && selectedEvent
              ? { start: selectedEvent.start, end: selectedEvent.end }
              : undefined
          }
          onClose={() => setModalOpen(false)}
          onSave={async (activityData) => {
            try {
              // Build API payload
              const formattedEvent: any = {
                summary: activityData.title,
                description: activityData.description,
                start: {
                  dateTime: toLocalRFC3339(activityData.startTime as Date),
                  timeZone,
                },
                end: {
                  dateTime: toLocalRFC3339(activityData.endTime as Date),
                  timeZone,
                },
                location: activityData.location,
              };

              if (modalMode === "create") {
                await createEvent(formattedEvent, selectedCalendarId);
                success("Event created successfully");
              } else {
                if (!selectedEvent?.id) {
                  error("Cannot update event: missing ID");
                  throw new Error("missing id");
                }
                await updateEvent(selectedEvent.id, formattedEvent);
                success("Event updated successfully");
              }

              await fetchEvents();
            } catch (err) {
              console.error("Failed to save event (ActivityDialog):", err);
              throw err;
            }
          }}
          onDelete={async () => {
            try {
              if (!selectedEvent?.id) {
                error("Cannot delete event: missing ID");
                return;
              }
              await deleteEvent(selectedEvent.id);
              success("Event deleted successfully");
              await fetchEvents();
            } catch (err) {
              console.error("Failed to delete event (ActivityDialog):", err);
              throw err;
            }
          }}
        />
      )}
    </div>
  );
};

export default GoogleCalendar;
