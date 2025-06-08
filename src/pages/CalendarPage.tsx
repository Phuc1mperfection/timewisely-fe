import { useUserActivities } from "@/hooks/useUserActivities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventModal } from "@/components/dashboard/EventModal";
import { ScheduleCalendar } from "@/components/dashboard/ScheduleCalendar";
import { useState } from "react";
import type { View } from "react-big-calendar";

const CalendarPage = () => {
  const {
    activities,
    isActivityModalOpen,
    setIsActivityModalOpen,
    selectedActivity,
    selectedSlot,
    handleSelectSlot,
    handleSelectActivity,
    handleActivityDrop,
    handleActivityResize,
    handleSaveActivity,
    handleDeleteActivity,
    activityStyleGetter,
  } = useUserActivities();
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--wisely-dark)]">Calendar</h1>
          <p className="text-[var(--wisely-gray)]">
            Manage your schedule and activities - drag to reschedule!
          </p>
        </div>
        <Button
          onClick={() => {
            handleSelectSlot({
              start: new Date(),
              end: new Date(Date.now() + 3600000),
            });
          }}
          className="bg-[var(--wisely-purple)] hover:bg-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-[var(--wisely-dark)]">Your Schedule</CardTitle>
          <CardDescription className="text-[var(--wisely-gray)]">
            Click on any time slot to create an activity, click existing
            activities to edit them, or drag activities to reschedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[900px]">
            <ScheduleCalendar
              events={activities}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectActivity}
              onEventDrop={(args) =>
                handleActivityDrop({
                  activity: args.event,
                  start: args.start,
                  end: args.end,
                })
              }
              onEventResize={(args) =>
                handleActivityResize({
                  activity: args.event,
                  start: args.start,
                  end: args.end,
                })
              }
              eventStyleGetter={activityStyleGetter}
              views={["month", "week", "day", "agenda"]}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
            />
          </div>
        </CardContent>
      </Card>

      <EventModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={selectedActivity}
        timeSlot={selectedSlot}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
};

export default CalendarPage;
