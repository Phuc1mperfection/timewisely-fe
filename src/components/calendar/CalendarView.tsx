import React, { useState, useCallback, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  // syncCalendarEvents removed as it's no longer needed
} from "@/services/calendarServices";
import type { CalendarEvent } from "@/services/calendarServices";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/useAuth";
import { Loader, Plus, AlertCircle } from "lucide-react"; // Added AlertCircle
import CalendarEventModal from "./CalendarEventModal";
import ConnectGoogleButton from "./ConnectGoogleButton";
import CalendarSelector from "./CalendarSelector"; // Import CalendarSelector
const localizer = momentLocalizer(moment);

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
  originalEvent?: unknown; // Changed from CalendarEvent to unknown to match EventData
}

// Backend event format (from EventDto)
interface BackendEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  isAllDay?: boolean;
  status?: string;
}

const CalendarView: React.FC = () => {
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

  // Kiểm tra xem người dùng đăng nhập bằng Google (OAuth) hay không
  const isGoogleUser =
    user?.googleConnected ||
    user?.googleCalendarSynced ||
    (user?.email && user?.email.includes("@gmail.com"));

  const fetchEvents = useCallback(async () => {
    try {
      console.log("Fetching events for all selected calendars");
      setApiError(null);
      setLoading(true);

      // Lấy ngày hiện tại
      const now = new Date();

      // Lấy ngày đầu tiên của tháng hiện tại
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Lấy ngày cuối cùng của tháng tiếp theo
      const lastDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        0
      );

      // Format thành ISO string
      const timeMin = firstDayOfMonth.toISOString();
      const timeMax = lastDayOfNextMonth.toISOString();

      console.log("Date range for events:", {
        timeMin,
        timeMax,
        firstDayOfMonth: firstDayOfMonth.toLocaleString(),
        lastDayOfNextMonth: lastDayOfNextMonth.toLocaleString(),
        selectedCalendarIds,
      });

      try {
        // Sử dụng getAllEvents để lấy events từ tất cả calendar
        console.log("Fetching all events from all calendars");

        const response = await getAllEvents({
          timeMin,
          timeMax,
          maxResults: 100,
        });
        console.log("Raw event data:", response);

        // Check if response is in the backend format or Google API format
        let transformedEvents: TransformedEvent[] = [];

        if (Array.isArray(response)) {
          console.log("Processing response as direct array of events");

          // Lọc events nếu có selectedCalendarIds
          let filteredEvents = response;
          if (selectedCalendarIds.length > 0) {
            console.log(
              `Filtering events for ${selectedCalendarIds.length} selected calendars`
            );
            filteredEvents = response.filter(
              (event: BackendEvent & { calendarId?: string }) =>
                !event.calendarId ||
                selectedCalendarIds.includes(event.calendarId)
            );
            console.log(
              `Filtered from ${response.length} to ${filteredEvents.length} events`
            );
          }

          // Backend returns array of events directly
          transformedEvents = filteredEvents
            .filter((event: BackendEvent) => {
              // Log any problematic events
              if (!event || !event.id || !event.summary) {
                console.warn("Invalid event detected:", event);
                return false;
              }
              return true;
            })
            .map(
              (
                event: BackendEvent & {
                  calendarId?: string;
                  calendarName?: string;
                }
              ) => ({
                id: event.id,
                title: event.summary,
                start: new Date(event.startDateTime),
                end: new Date(event.endDateTime),
                description: event.description,
                location: event.location,
                colorId: event.colorId,
                calendarId: event.calendarId,
                calendarName: event.calendarName,
                originalEvent: {
                  id: event.id,
                  summary: event.summary,
                  description: event.description,
                  location: event.location,
                  colorId: event.colorId,
                  calendarId: event.calendarId,
                  calendarName: event.calendarName,
                  start: { dateTime: event.startDateTime },
                  end: { dateTime: event.endDateTime },
                },
              })
            );

          console.log("Converted backend events:", transformedEvents);
        } else if (
          response &&
          response.items &&
          Array.isArray(response.items)
        ) {
          console.log("Processing response with items array format");
          // Google API format response (items array)
          transformedEvents = response.items
            .filter((event: CalendarEvent) => {
              const valid =
                event &&
                event.id &&
                event.summary &&
                event.start &&
                event.start.dateTime &&
                event.end &&
                event.end.dateTime;

              if (!valid) {
                console.warn("Invalid Google Calendar event detected:", event);
                return false;
              }
              return true;
            })
            .map((event: CalendarEvent) => ({
              id: event.id,
              title: event.summary,
              start: new Date(event.start.dateTime),
              end: new Date(event.end.dateTime),
              description: event.description,
              location: event.location,
              colorId: event.colorId,
              originalEvent: event,
            }));
        } else {
          // Empty or unrecognized response
          console.warn("No events or unrecognized data format:", response);
          console.log("Response type:", typeof response);
          console.log("Response properties:", Object.keys(response || {}));
          setApiError("Received unexpected data format from server");
        }

        console.log("Transformed events:", transformedEvents);
        setEvents(transformedEvents);
      } catch (err) {
        // This catches any error thrown by getEvents function
        console.error("Failed to fetch events:", err);

        // Extract more error details if available
        const errObj = err as {
          message?: string;
          response?: { status?: number; data?: unknown };
        };
        console.error("Error details:", {
          message: errObj.message,
          status: errObj.response?.status,
          responseData: errObj.response?.data,
        });

        // Set a specific error message for network errors (likely CORS)
        let errorMessage = "Failed to load calendar events";

        if (err instanceof Error) {
          if (err.message === "Network Error") {
            errorMessage =
              "Network error: This may be due to CORS restrictions or the server is not responding.";
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }

        setApiError(errorMessage);
        error(errorMessage);
      }
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
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
        },
      });
      setModalMode("create");
      setModalOpen(true);
    },
    []
  );

  const handleSelectEvent = useCallback((event: TransformedEvent) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(
    async (eventData: {
      id?: string;
      title: string;
      description?: string;
      start: Date;
      end: Date;
      location?: string;
      colorId?: string;
      calendarId?: string;
      calendarName?: string;
      originalEvent?: unknown;
    }) => {
      try {
        // Format event for the API
        const formattedEvent = {
          summary: eventData.title,
          description: eventData.description,
          start: {
            dateTime: eventData.start.toISOString(),
          },
          end: {
            dateTime: eventData.end.toISOString(),
          },
          location: eventData.location,
        };

        if (modalMode === "create") {
          await createEvent(formattedEvent, selectedCalendarId);
          success("Event created successfully");
        } else if (eventData.id) {
          // Check if id exists
          await updateEvent(eventData.id, formattedEvent);
          success("Event updated successfully");
        } else {
          error("Cannot update event: missing ID");
        }

        setModalOpen(false);
        fetchEvents(); // Refresh events
      } catch (err) {
        console.error("Failed to save event:", err);
        error(
          modalMode === "create"
            ? "Failed to create event"
            : "Failed to update event"
        );
      }
    },
    [modalMode, fetchEvents, success, error, selectedCalendarId]
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      try {
        await deleteEvent(eventId);
        success("Event deleted successfully");
        setModalOpen(false);
        fetchEvents(); // Refresh events
      } catch (err) {
        console.error("Failed to delete event:", err);
        error("Failed to delete event");
      }
    },
    [fetchEvents, success, error]
  );

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
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
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
          <button
            onClick={fetchEvents}
            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Refresh Events
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[600px]">
          <Loader className="w-10 h-10 animate-spin text-purple-500" />
        </div>
      ) : events.length > 0 ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.WEEK}
          className="bg-white/5 rounded-xl p-4"
          tooltipAccessor={(event) => {
            const title = event.title;
            const time = `${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}`;
            const description = event.description || "";
            const location = event.location ? `📍 ${event.location}` : "";
            const calendar = event.calendarName
              ? `📅 ${event.calendarName}`
              : "";
            return `${title}\n${time}\n${description}\n${location}\n${calendar}`;
          }}
          eventPropGetter={(event) => {
            const colorId = event.colorId || "1";
            // Chọn màu dựa trên colorId
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
            const defaultColor = "#9FC5E8"; // Màu mặc định
            return {
              style: {
                backgroundColor: colorMap[colorId] || defaultColor,
                borderRadius: "4px",
                opacity: 0.8,
                border: "0px",
                color: "#000",
              },
            };
          }}
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

      {modalOpen && selectedEvent && (
        <CalendarEventModal
          isOpen={modalOpen}
          mode={modalMode}
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
