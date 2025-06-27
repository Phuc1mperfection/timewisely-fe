import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { ActivityFilterBar } from "@/components/dashboard/ActivityFilterBar";
import { useUserActivities } from "@/hooks/useUserActivities";
import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventModal } from "@/components/dashboard/EventModal";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
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
    error,
    success,
    setError,
    setSuccess,
    setSelectedActivity, // Import setSelectedActivity
  } = useUserActivities();
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterAllDay, setFilterAllDay] = useState<null | boolean>(null);

  // Filtered activities
  const filteredActivities = activities.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterColor && a.color !== filterColor) return false;
    if (filterAllDay !== null && a.allDay !== filterAllDay) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 relative">
      <ActivityToastListener
        error={error}
        success={success}
        onResetError={() => setError(null)}
        onResetSuccess={() => setSuccess(null)}
      />
      <ActivityFilterBar
        search={search}
        setSearch={setSearch}
        filterColor={filterColor}
        setFilterColor={setFilterColor}
        filterAllDay={filterAllDay}
        setFilterAllDay={setFilterAllDay}
      />
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold ">
            Calendar
          </h1>
          <CardDescription>
            Manage your schedule and activities - drag to reschedule!
          </CardDescription> */}
        </div>
        <Button
          onClick={() => {
            handleSelectSlot({
              start: new Date(),
              end: new Date(Date.now() + 3600000),
            });
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Activity
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="h-[900px]">
            <ScheduleCalendar
            className="modern-calendar"
              events={filteredActivities}
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
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onEventDelete={(event) => {
                setSelectedActivity(event); // Use setSelectedActivity from useUserActivities
                handleDeleteActivity();
              }}
              
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
