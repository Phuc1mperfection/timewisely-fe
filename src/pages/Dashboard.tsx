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
import { ScheduleCalendar } from "@/components/dashboard/ScheduleCalendar";
import { useUserActivities } from "@/hooks/useUserActivities";
import  { useState } from "react";
import type { View } from "react-big-calendar";

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
  } = useUserActivities();
   const [view, setView] = useState<View>("week");
    const [date, setDate] = useState(new Date());

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
                Click on any time slot to create an activity, or click existing
                activities to edit them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
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
