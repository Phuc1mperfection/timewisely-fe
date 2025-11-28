import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Sparkles, Clock, Target, ChevronRight, Home } from "lucide-react";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import { useActivities } from "@/hooks/useActivity";
import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { useState } from "react";
import { DailyMotivationHub } from "@/components/dashboard/DailyMotivationHub";

// Stat Card Component for better reusability
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconClassName?: string;
}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconClassName || "text-primary"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Breadcrumb Component
function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">Dashboard</span>
    </nav>
  );
}

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

  // Helper: convert {startTime, endTime} to {start, end}
  const slotToLegacy = (slot: { startTime: Date; endTime: Date } | null) =>
    slot ? { start: slot.startTime, end: slot.endTime } : null;

  return (
    <main className="flex-1 flex flex-col bg-background">
      <ActivityToastListener
        error={error}
        success={success}
        onResetError={() => setError(null)}
        onResetSuccess={() => setSuccess(null)}
      />

      {/* Main Content Container */}
      <div className="flex-1 container max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <Breadcrumb />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
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
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              New Activity
            </Button>
          </div>
        </div>

        <Separator />

        {/* Stats Cards Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Today's Schedule"
              value="3 events"
              description="2 hours of free time"
              icon={Clock}
              iconClassName="text-primary"
            />
            <StatCard
              title="AI Suggestions"
              value="5 new"
              description="Based on your preferences"
              icon={Sparkles}
              iconClassName="text-primary"
            />
            <StatCard
              title="Goals Progress"
              value="78%"
              description="This week's completion"
              icon={Target}
              iconClassName="text-primary"
            />
          </div>
        </section>

        {/* Daily Motivation Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Daily Motivation
          </h2>
          <DailyMotivationHub />
        </section>

        {/* Calendar & AI Suggestions Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Schedule
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Calendar */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Calendar</CardTitle>
                <CardDescription>
                  Click on any time slot to create an activity, or click existing
                  activities to edit them.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[600px]">
                  <ScheduleCalendar
                    className="modern-calendar"
                    events={activities}
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
