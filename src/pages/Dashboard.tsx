import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Clock, Target, Sparkles } from "lucide-react";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import { useActivities } from "@/hooks/useActivity";
import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { useState } from "react";
import { ActivityFilterBar } from "@/components/dashboard/ActivityFilterBar";
import type { Activity } from "@/interfaces/Activity";
import { DailyMotivationHub } from "@/components/dashboard/DailyMotivationHub";

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
  } = useActivities();
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterAllDay, setFilterAllDay] = useState<null | boolean>(null);

  // Filtered activities
  const filteredActivities = activities.filter((a: Activity) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filterColor && a.color !== filterColor) return false;
    if (filterAllDay !== null && a.allDay !== filterAllDay) return false;
    return true;
  });

  // Helper: convert {startTime, endTime} to {start, end}
  const slotToLegacy = (slot: { startTime: Date; endTime: Date } | null) =>
    slot ? { start: slot.startTime, end: slot.endTime } : null;

  return (
    <main className="flex-1 flex flex-col">
      <ActivityToastListener
        error={error}
        success={success}
        onResetError={() => setError(null)}
        onResetSuccess={() => setSuccess(null)}
      />
      
      {/* Hidden filter bar */}
      <div className="p-6 bg-card shadow-sm hidden">
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

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here's your productivity overview.
            </p>
          </div>
          <Button
            onClick={() => {
              handleSelectSlot({
                startTime: new Date(),
                endTime: new Date(Date.now() + 3600000),
              });
            }}
          >
            <Plus className="h-4 w-4" />
            New Activity
          </Button>
        </div>

        <Separator />

        {/* Stats Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Schedule
                </CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 events</div>
                <p className="text-xs text-muted-foreground">
                  2 hours of free time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  AI Suggestions
                </CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5 new</div>
                <p className="text-xs text-muted-foreground">
                  Based on your preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Goals Progress
                </CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">
                  This week's completion
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Daily Motivation Hub */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Daily Motivation</h2>
          <DailyMotivationHub />
        </section>

        {/* Calendar and AI Suggestions Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Your Schedule</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  Click on any time slot to create an activity, or click existing
                  activities to edit them.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[700px]">
                  <ScheduleCalendar
                    className="modern-calendar"
                    events={filteredActivities}
                    onSelectSlot={(slot) =>
                      handleSelectSlot({
                        startTime: slot.start,
                        endTime: slot.end,
                      })
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
                    view="day"
                    date={date}
                    onNavigate={setDate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <AISuggestions />
          </div>
        </section>
      </div>

      {/* Activity Modal */}
      <ActivityDialog
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={
          selectedActivity
            ? {
                ...selectedActivity,
                startTime: selectedActivity.startTime,
                endTime: selectedActivity.endTime,
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
    </main>
  );
}
