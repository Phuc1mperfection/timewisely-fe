import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { ActivityFilterBar } from "@/components/dashboard/ActivityFilterBar";
import { useActivities } from "@/hooks/useActivity";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NewActivityButton } from "@/components/activities/NewActivityButton";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import type { View } from "react-big-calendar";
import type { Activity } from "@/interfaces/Activity";

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
  } = useActivities();
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterAllDay, setFilterAllDay] = useState<null | boolean>(null);

  // Helper: convert {startTime, endTime} to {start, end}
  const slotToLegacy = (slot: { startTime: Date; endTime: Date } | null) =>
    slot ? { start: slot.startTime, end: slot.endTime } : null;

  // Filtered activities
  const filteredActivities = activities.filter((a: Activity) => {
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
      <div className="flex items-center justify-between gap-4 mb-4">
        <ActivityFilterBar
          search={search}
          setSearch={setSearch}
          filterColor={filterColor}
          setFilterColor={setFilterColor}
          filterAllDay={filterAllDay}
          setFilterAllDay={setFilterAllDay}
        />
        <div>
          <NewActivityButton
            onOpenModal={() => {
              handleSelectSlot({
                startTime: new Date(),
                endTime: new Date(Date.now() + 3600000),
              });
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="h-[900px]">
            <ScheduleCalendar
              className="modern-calendar"
              events={filteredActivities}
              onSelectSlot={(slot) =>
                handleSelectSlot({ startTime: slot.start, endTime: slot.end })
              }
              onSelectEvent={handleSelectActivity}
              onEventDrop={(args) =>
                handleActivityDrop({
                  activity: args.event,
                  startTime: args.start,
                  endTime: args.end,
                })
              }
              onEventResize={(args) =>
                handleActivityResize({
                  activity: args.event,
                  startTime: args.start,
                  endTime: args.end,
                })
              }
              eventStyleGetter={activityStyleGetter}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onEventDelete={(activityId) => {
                handleDeleteActivity(activityId);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <ActivityDialog
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={
          selectedActivity
            ? {
                ...selectedActivity,
                start: selectedActivity.startTime,
                end: selectedActivity.endTime,
              }
            : null
        }
        timeSlot={slotToLegacy(selectedSlot)}
        onSave={handleSaveActivity}
        onDelete={() => {
          if (selectedActivity) {
            handleDeleteActivity(selectedActivity.id);
          }
        }}
      />
    </div>
  );
};

export default CalendarPage;
