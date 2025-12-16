import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import GoogleCalendar from "@/components/calendar/GoogleCalendar";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/useToast";

// Import existing components
import { ActivityToastListener } from "@/components/dashboard/ActivityToastListener";
import { ActivityFilterBar } from "@/components/dashboard/ActivityFilterBar";
import { useActivities } from "@/hooks/useActivity";
import { useTasks } from "@/hooks/useTasks";
import { NewActivityButton } from "@/components/activities/NewActivityButton";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";
import { ActivityList } from "@/components/activities/ActivityLists";
import { ScheduleCalendar } from "@/components/dashboard/Calendar";
import type { View } from "react-big-calendar";
import type { Activity } from "@/interfaces/Activity";
import { AISuggestions } from "@/components/dashboard/AISuggestions";

const CalendarPage: React.FC = () => {
  const { loading, getCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("timewisely");
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [oauthComplete, setOAuthComplete] = useState(false);

  // Handle OAuth callback for Google Calendar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const oauthError = params.get("error");
    const code = params.get("code"); // Google OAuth returns code

    // Kiểm tra localStorage để tránh hiện thông báo nhiều lần
    const alreadyProcessed = localStorage.getItem("googleOAuthProcessed");

    // Debug the OAuth params received
    // Only process when there are OAuth related params to avoid infinite loops
    if ((token || oauthError || code) && !oauthComplete && !alreadyProcessed) {
      console.log("Processing OAuth callback");
      setOAuthComplete(true); // Set flag to prevent repeated processing

      // Lưu trạng thái đã xử lý để tránh hiển thị toast nhiều lần
      localStorage.setItem("googleOAuthProcessed", "true");

      // Clean the URL to prevent repeated processing on refresh
      const cleanUrl = "/dashboard/calendar";
      navigate(cleanUrl, { replace: true });

      // Process the OAuth result
      if (token) {
        console.log("OAuth successful - token present");
        localStorage.setItem("googleCalendarConnected", "true");
        success("Successfully connected to Google Calendar");

        // Refresh user data to get updated Google Calendar connection status
        if (getCurrentUser) {
          getCurrentUser()
            .then(() => {
              console.log(
                "User data refreshed after Google Calendar connection"
              );
            })
            .catch((error: unknown) => {
              console.error("Failed to refresh user data:", error);
            });
        } else {
          console.log("getCurrentUser function not available");
        }
      } else if (code) {
        console.log("OAuth code received, waiting for backend to process");
        success(
          "Google authentication successful, setting up calendar access..."
        );

        // The code will be processed by the backend, we just need to wait
        // for the user data to be updated
        setTimeout(() => {
          if (getCurrentUser) {
            getCurrentUser()
              .then(() => {
                console.log("User data refreshed after Google authentication");
              })
              .catch((error: unknown) => {
                console.error("Failed to refresh user data:", error);
              });
          } else {
            console.log("getCurrentUser function not available");
          }
        }, 2000); // Give backend a moment to process the code
      } else if (oauthError) {
        console.error("OAuth error:", oauthError);
        error(`Calendar connection failed: ${oauthError}`);
      }
    }
  }, [
    location.search,
    navigate,
    success,
    error,
    oauthComplete,
    getCurrentUser,
  ]);

  // Add a reset function for Google OAuth processing flag when page loads
  useEffect(() => {
    // Chỉ reset flag khi người dùng chủ động truy cập trang calendar
    // mà không phải từ callback OAuth
    const params = new URLSearchParams(location.search);
    const isOAuthCallback =
      params.has("token") || params.has("code") || params.has("error");

    if (!isOAuthCallback) {
      localStorage.removeItem("googleOAuthProcessed");
    }
  }, [location.search]);

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
    toggleActivityComplete,
    activityStyleGetter,
    error: activityError,
    success: activitySuccess,
    setError,
    setSuccess,
  } = useActivities();

  const { tasks, toggleComplete: toggleTaskComplete } = useTasks();

  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState<string | null>(null);
  const [filterAllDay, setFilterAllDay] = useState<null | boolean>(null);

  // Helper: convert {startTime, endTime} to {start, end}
  const slotToLegacy = useCallback(
    (slot: { startTime: Date; endTime: Date } | null) =>
      slot ? { start: slot.startTime, end: slot.endTime } : null,
    []
  );

  // Merge activities and tasks into one list
  const mergedActivities = useMemo(() => {
    const activityItems: Activity[] = activities.map((a) => ({
      ...a,
      type: "activity" as const,
    }));
    const taskItems: Activity[] = tasks.map((t) => ({
      id: t.id,
      title: t.name,
      startTime: t.dueDate,
      endTime: t.dueDate,
      description: t.description,
      color: "#3b82f6", // Default color for tasks
      allDay: true,
      completed: t.completed,
      type: "task" as const,
    }));
    return [...activityItems, ...taskItems];
  }, [activities, tasks]);

  // Filtered activities - memoize to avoid recalculation on every render
  const filteredActivities = useMemo(() => {
    return mergedActivities.filter((a: Activity) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (filterColor && a.color !== filterColor) return false;
      if (filterAllDay !== null && a.allDay !== filterAllDay) return false;
      return true;
    });
  }, [mergedActivities, search, filterColor, filterAllDay]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex flex-col h-screen">
      <ActivityToastListener
        error={activityError}
        success={activitySuccess}
        onResetError={() => setError(null)}
        onResetSuccess={() => setSuccess(null)}
      />

      <Tabs
        defaultValue="timewisely"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <TabsList className="mr-4">
              <TabsTrigger value="timewisely">TimeWisely Calendar</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="google">Google Calendar</TabsTrigger>
            </TabsList>

            {activeTab === "timewisely" && (
              <ActivityFilterBar
                search={search}
                setSearch={setSearch}
                filterColor={filterColor}
                setFilterColor={setFilterColor}
                filterAllDay={filterAllDay}
                setFilterAllDay={setFilterAllDay}
              />
            )}
          </div>

          {(activeTab === "timewisely" || activeTab === "activities") && (
            <NewActivityButton
              onOpenModal={() => {
                handleSelectSlot({
                  startTime: new Date(),
                  endTime: new Date(Date.now() + 3600000),
                });
              }}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="timewisely" className="h-full overflow-auto">
            <Card className="h-full">
              <CardContent className="h-full overflow-auto">
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
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={setDate}
                  onEventDelete={(activityId) => {
                    handleDeleteActivity(activityId);
                  }}
                  onToggleCompleted={(activity) => {
                    if (activity.type === "task") {
                      toggleTaskComplete(activity.id);
                    } else {
                      toggleActivityComplete(activity.id);
                    }
                  }}
                />
                <AISuggestions/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="h-full overflow-auto">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold">Activities</h1>
                  <p className="text-muted-foreground text-base">
                    Manage your activities and track your progress.
                  </p>
                </div>
                <ActivityList
                  activities={activities}
                  onToggleComplete={toggleActivityComplete}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="google" className="h-full overflow-auto p-6">
            <GoogleCalendar />
          </TabsContent>
        </div>
      </Tabs>

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
    </div>
  );
};

export default CalendarPage;
