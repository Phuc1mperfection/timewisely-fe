import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Sparkles, Clock, Target } from "lucide-react";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { EventModal } from "@/components/dashboard/EventModal";
import { DailyMotivationHub } from "@/components/dashboard/DailyMotivationHub";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import { useUserActivities } from "@/hooks/useUserActivities";
import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { useState } from "react";
import type { View } from "react-big-calendar";
import { ActivityFilterBar } from "@/components/dashboard/ActivityFilterBar";

export function DashboardContent() {
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
  } = useUserActivities();
  const [view, setView] = useState<View>("agenda");
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
    <main className="flex-1 flex flex-col">
      <ActivityToastListener
        error={error}
        success={success}
        onResetError={() => setError(null)}
        onResetSuccess={() => setSuccess(null)}
      />
      <div className="p-6 bg-white shadow-sm hidden">
        <ActivityFilterBar
          search={search}
          setSearch={setSearch}
          filterColor={filterColor}
          setFilterColor={setFilterColor}
          filterAllDay={filterAllDay}
          setFilterAllDay={setFilterAllDay}
          loading={false}
        />
      </div>
      {/* Top Navigation */}
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-gray-900">
              Dashboard
            </h1>
            <CardDescription>
              Welcome back! Here's your productivity overview.
            </CardDescription>
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
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className=" shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium ">
                Today's Schedule
              </CardTitle>
              <Clock className="h-4 w-4 text-[var(--wisely-purple)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                3 events
              </div>
              <p className="text-xs text-[var(--wisely-gray)]">2 hours of free time</p>
            </CardContent>
          </Card>

          <Card className=" shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium ">
                AI Suggestions
              </CardTitle>
              <Sparkles className="h-4 w-4 text-[var(--wisely-mint)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                5 new
              </div>
              <p className="text-xs text-[var(--wisely-gray)]">
                Based on your preferences
              </p>
            </CardContent>
          </Card>

          <Card className=" shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium ">
                Goals Progress
              </CardTitle>
              <Target className="h-4 w-4 text-[var(--wisely-pink)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                78%
              </div>
              <p className="text-xs text-[var(--wisely-gray)]">This week's completion</p>
            </CardContent>
          </Card>
        </div>
        {/* Daily Motivation Hub */}
        <DailyMotivationHub />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-3 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="">
                Calendar
              </CardTitle>
              <CardDescription className="text-[var(--wisely-gray)]">
                Click on any time slot to create an activity, or click existing
                activities to edit them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
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
                  views={["month", "week", "day", "agenda"]}
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <AISuggestions />
        </div>
      </div>

      {/* Activity Modal */}
      <EventModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={selectedActivity}
        timeSlot={selectedSlot}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </main>
  );
}
