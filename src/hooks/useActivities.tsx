import { useState, useEffect } from "react";
import { useToast } from "./useToast";
import apiClient from "@/services/apiClient";
export interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  color?: string;
  label?: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: errorToast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<Activity[]>("/activities");
      setActivities(response.data);
    } catch (err) {
      setError("Failed to fetch activities. Please try again.");
      errorToast("Failed to fetch activities. Please try again.");
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActivityComplete = async (activityId: string) => {
    try {
      const activity = activities.find((a) => a.id === activityId);
      if (!activity) return;
      // Optimistic update
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId ? { ...a, completed: !a.completed } : a
        )
      );
      await apiClient.patch(`/activities/${activityId}/complete`);
      success(
        !activity.completed
          ? `Activity completed! ${activity.title}`
          : `Activity marked as incomplete: ${activity.title}`
      );
    } catch (err) {
      // Revert optimistic update on error
      console.error("Error toggling activity completion:", err);
      setActivities((prev) =>
        prev.map((a) =>
          a.id === activityId ? { ...a, completed: !a.completed } : a
        )
      );
      errorToast("Failed to update activity status. Please try again.");
    }
  };

  return {
    activities,
    isLoading,
    error,
    toggleActivityComplete,
    refetch: fetchActivities,
  };
};
