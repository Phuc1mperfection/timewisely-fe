import { useState, useEffect } from "react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/services/activityServices";
import type { ActivityApiData } from "@/services/activityServices";
import { useToast } from "./useToast";
import type { Activity } from "@/interfaces/Activity";


function mapApiToUserActivity(api: ActivityApiData): Activity {
  return {
    id: api.id || '',
    title: api.title,
    startTime: new Date(api.startTime),
    endTime: new Date(api.endTime),
    description: api.description,
    color: api.color,
    allDay: api.allDay,
    location: api.location,
    goalTag: api.goalTag,
    completed: api.completed,
  };
}

function mapUserActivityToApi(activity: Partial<Activity>): ActivityApiData {
  return {
    id: activity.id,
    title: activity.title || "",
    description: activity.description,
    startTime: activity.startTime instanceof Date ? activity.startTime.toISOString() : "",
    endTime: activity.endTime instanceof Date ? activity.endTime.toISOString() : "",
    color: activity.color,
    allDay: activity.allDay,
    location: activity.location,
    goalTag: activity.goalTag,
    completed: activity.completed,
  };
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: Date; endTime: Date } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();

  // Đổi fetchActivities thành hàm thường để tránh bị re-create liên tục
  async function fetchActivities() {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data.map(mapApiToUserActivity));
      setError(null);
    } catch {
      setError("Failed to load activities");
      toastError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleActivityComplete = async (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;
    // Optimistic update
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, completed: !a.completed } : a
      )
    );
    try {
      await updateActivity(activityId, mapUserActivityToApi({ ...activity, completed: !activity.completed }));
      toastSuccess(
        !activity.completed
          ? `Activity completed! ${activity.title}`
          : `Activity marked as incomplete: ${activity.title}`
      );
    } catch (err) {
      // Revert optimistic update on error
      console.error("Failed to update activity status:", err);
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId ? { ...a, completed: activity.completed } : a
        )
      );
      toastError("Failed to update activity status. Please try again.");
    }
  };

  const handleSelectSlot = (slotInfo: { startTime: Date; endTime: Date }) => {
    setSelectedSlot(slotInfo);
    setSelectedActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleSelectActivity = (activity: object) => {
    setSelectedActivity(activity as Activity);
    setSelectedSlot(null);
    setIsActivityModalOpen(true);
  };

  const handleActivityDrop = async (args: { activity: object; startTime: Date | string; endTime: Date | string }) => {
    const activity = args.activity as Activity;
    const startTime = typeof args.startTime === "string" ? new Date(args.startTime) : args.startTime;
    const endTime = typeof args.endTime === "string" ? new Date(args.endTime) : args.endTime;
    // Xác định allDay dựa vào giờ
    let newAllDay = activity.allDay;
    if (
      startTime.getHours() !== 0 || startTime.getMinutes() !== 0 ||
      endTime.getHours() !== 23 && endTime.getMinutes() !== 59
    ) {
      newAllDay = false;
    }
    if (
      startTime.getHours() === 0 && startTime.getMinutes() === 0 &&
      endTime.getHours() === 23 && endTime.getMinutes() === 59
    ) {
      newAllDay = true;
    }
    setLoading(true);
    try {
      await updateActivity(activity.id, mapUserActivityToApi({ ...activity, startTime, endTime, allDay: newAllDay }));
      setActivities((prev) =>
        prev.map((existingActivity) =>
          existingActivity.id === activity.id ? { ...existingActivity, startTime, endTime, allDay: newAllDay } : existingActivity
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

  const handleSaveActivity = async (activityData: Partial<Activity>) => {
    setLoading(true);
    try {
      if (selectedActivity) {
        await updateActivity(selectedActivity.id, mapUserActivityToApi({ ...selectedActivity, ...activityData }));
        await fetchActivities();
        setSuccess("Activity updated");
      } else if (selectedSlot) {
        const startTime = activityData.startTime || selectedSlot.startTime;
        const endTime = activityData.endTime || selectedSlot.endTime;
        const apiData = mapUserActivityToApi({ ...activityData, startTime, endTime });
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
const handleDeleteActivity = async (activityId: string) => {
  setLoading(true);
  try {
    await deleteActivity(activityId);
    setActivities((prev) =>
      prev.filter((activity) => activity.id !== activityId)
    );
    setSuccess("Activity deleted");
    setIsActivityModalOpen(false);
  } catch {
    setError("Failed to delete activity");
  } finally {
    setLoading(false);
  }
};



  const activityStyleGetter = (activity: object) => {
    const userActivity = activity as Activity;
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
    toggleActivityComplete,
  };
}
