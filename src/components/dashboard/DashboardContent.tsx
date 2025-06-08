import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Sparkles, Clock, Target } from "lucide-react";
import { AISuggestions } from "./AISuggestions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EventModal } from "./EventModal";
import { DailyMotivationHub } from "./DailyMotivationHub";
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: new Date(2024, 5, 15, 9, 0),
    end: new Date(2024, 5, 15, 10, 0),
    description: "Weekly team sync",
    color: "#8b5cf6", // Updated to purple
  },
  {
    id: "2",
    title: "Workout Session",
    start: new Date(2024, 5, 16, 18, 0),
    end: new Date(2024, 5, 16, 19, 30),
    description: "Gym workout",
    color: "#5eead4", // Updated to mint
  },
];

export function DashboardContent() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else if (selectedSlot) {
      // Create new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventData.title || "New Event",
        start: selectedSlot.start,
        end: selectedSlot.end,
        description: eventData.description,
        color: eventData.color || "#3B82F6",
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents((prev) =>
        prev.filter((event) => event.id !== selectedEvent.id)
      );
      setIsEventModalOpen(false);
    }
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || "#8b5cf6", // Default to purple
        border: "none",
        borderRadius: "6px",
        color: "white",
        padding: "2px 6px",
      },
    };
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Top Navigation */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-wisely-dark">Dashboard</h1>
            <p className="text-wisely-gray">
              Welcome back! Here's your productivity overview.
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedSlot({
                start: new Date(),
                end: new Date(Date.now() + 3600000),
              });
              setSelectedEvent(null);
              setIsEventModalOpen(true);
            }}
            className="bg-wisely-purple hover:bg-purple-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-wisely-dark">
                Today's Schedule
              </CardTitle>
              <Clock className="h-4 w-4 text-wisely-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wisely-dark">
                3 events
              </div>
              <p className="text-xs text-wisely-gray">2 hours of free time</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-wisely-dark">
                AI Suggestions
              </CardTitle>
              <Sparkles className="h-4 w-4 text-wisely-mint" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wisely-dark">5 new</div>
              <p className="text-xs text-wisely-gray">
                Based on your preferences
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-wisely-dark">
                Goals Progress
              </CardTitle>
              <Target className="h-4 w-4 text-wisely-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-wisely-dark">78%</div>
              <p className="text-xs text-wisely-gray">This week's completion</p>
            </CardContent>
          </Card>
        </div>
        {/* Daily Motivation Hub */}
        <DailyMotivationHub />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-3 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-wisely-dark">Calendar</CardTitle>
              <CardDescription className="text-wisely-gray">
                Click on any time slot to create an event, or click existing
                events to edit them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  views={["month", "week", "day"]}
                  defaultView="week"
                  style={{ height: "100%" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <AISuggestions />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        timeSlot={selectedSlot}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </main>
  );
}
