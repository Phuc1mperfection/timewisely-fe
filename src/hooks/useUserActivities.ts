import { useState, useEffect, useCallback } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/services/activityServices";
import type { ActivityApiData } from "@/services/activityServices";

export interface UserActivity {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
  allDay?: boolean;
  location?: string;
  goalTag?: string;
  category?: string;
  completed?: boolean;
}

function mapApiToUserActivity(api: ActivityApiData): UserActivity {
  return {
    id: api.id || '',
    title: api.title,
    start: new Date(api.startTime),
    end: new Date(api.endTime),
    description: api.description,
    color: api.color,
    allDay: api.allDay,
    location: api.location,
    goalTag: api.goalTag,
    completed: api.completed,
  };
}

function mapUserActivityToApi(activity: Partial<UserActivity>): ActivityApiData {
  return {
    id: activity.id,
    title: activity.title || "",
    description: activity.description,
    startTime: activity.start instanceof Date ? activity.start.toISOString() : "",
    endTime: activity.end instanceof Date ? activity.end.toISOString() : "",
    color: activity.color,
    allDay: activity.allDay,
    location: activity.location,
    goalTag: activity.goalTag,
    completed: activity.completed,
  };
}

export function useUserActivities() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data.map(mapApiToUserActivity));
      setError(null);
    } catch {
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleSelectActivity = (activity: object) => {
    setSelectedActivity(activity as UserActivity);
    setSelectedSlot(null);
    setIsActivityModalOpen(true);
  };

  const handleActivityDrop = async (args: { activity: object; start: Date | string; end: Date | string }) => {
    const activity = args.activity as UserActivity;
    const start = typeof args.start === "string" ? new Date(args.start) : args.start;
    const end = typeof args.end === "string" ? new Date(args.end) : args.end;
    // Xác định allDay dựa vào giờ
    let newAllDay = activity.allDay;
    if (
      start.getHours() !== 0 || start.getMinutes() !== 0 ||
      end.getHours() !== 23 && end.getMinutes() !== 59
    ) {
      newAllDay = false;
    }
    if (
      start.getHours() === 0 && start.getMinutes() === 0 &&
      end.getHours() === 23 && end.getMinutes() === 59
    ) {
      newAllDay = true;
    }
    setLoading(true);
    try {
      await updateActivity(activity.id, mapUserActivityToApi({ ...activity, start, end, allDay: newAllDay }));
      setActivities((prev) =>
        prev.map((existingActivity) =>
          existingActivity.id === activity.id ? { ...existingActivity, start, end, allDay: newAllDay } : existingActivity
        )
      );
      setSuccess("Activity updated");
    } catch {
      setError("Failed to update activity");
    } finally {
      setLoading(false);
    }
  };

  const handleActivityResize = handleActivityDrop;

  const handleSaveActivity = async (activityData: Partial<UserActivity>) => {
    setLoading(true);
    try {
      if (selectedActivity) {
        await updateActivity(selectedActivity.id, mapUserActivityToApi({ ...selectedActivity, ...activityData }));
        await fetchActivities();
        setSuccess("Activity updated");
      } else if (selectedSlot) {
        const start = activityData.start || selectedSlot.start;
        const end = activityData.end || selectedSlot.end;
        const apiData = mapUserActivityToApi({ ...activityData, start, end });
        await createActivity(apiData);
        await fetchActivities();
        setSuccess("Activity created");
      }
      setIsActivityModalOpen(false);
    } catch {
      setError("Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (selectedActivity) {
      setLoading(true);
      try {
        await deleteActivity(selectedActivity.id);
        setActivities((prev) => prev.filter((activity) => activity.id !== selectedActivity.id));
        setSuccess("Activity deleted");
        setIsActivityModalOpen(false);
      } catch {
        setError("Failed to delete activity");
      } finally {
        setLoading(false);
      }
    }
  };

  const activityStyleGetter = (activity: object) => {
    const userActivity = activity as UserActivity;
    return {
      style: {
        backgroundColor: userActivity.color || "#8b5cf6",
        border: "none",
        borderRadius: "6px",
        color: "white",
        padding: "2px 6px",
        cursor: "grab",
      },
    };
  };

  return {
    activities,
    setActivities,
    isActivityModalOpen,
    setIsActivityModalOpen,
    selectedActivity,
    setSelectedActivity,
    selectedSlot,
    setSelectedSlot,
    handleSelectSlot,
    handleSelectActivity,
    handleActivityDrop,
    handleActivityResize,
    handleSaveActivity,
    handleDeleteActivity,
    activityStyleGetter,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchActivities,
  };
}
