import { useState } from "react";

export interface UserActivity {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
}

export function getInitialActivities(): UserActivity[] {
  const now = new Date();
  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const setTime = (date: Date, hour: number, minute: number) => {
    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);
    return d;
  };
  return [
    {
      id: "1",
      title: "Morning Workout",
      start: setTime(now, 7, 0),
      end: setTime(now, 8, 0),
      description: "Cardio and strength training",
      color: "#5eead4",
    },
    {
      id: "2",
      title: "Team Meeting",
      start: setTime(now, 10, 0),
      end: setTime(now, 11, 30),
      description: "Weekly team sync and project updates",
      color: "#8b5cf6",
    },
    {
      id: "3",
      title: "Study Time - React",
      start: setTime(addDays(now, 1), 14, 0),
      end: setTime(addDays(now, 1), 16, 0),
      description: "Deep dive into React hooks and state management",
      color: "#f9a8d4",
    },
    {
      id: "4",
      title: "Lunch Break",
      start: setTime(addDays(now, 2), 12, 0),
      end: setTime(addDays(now, 2), 13, 0),
      description: "Healthy meal and relaxation",
      color: "#fde68a",
    },
    {
      id: "5",
      title: "Client Call",
      start: setTime(addDays(now, 3), 15, 0),
      end: setTime(addDays(now, 3), 16, 0),
      description: "Quarterly review and planning session",
      color: "#8b5cf6",
    },
    {
      id: "6",
      title: "Evening Walk",
      start: setTime(addDays(now, 4), 18, 30),
      end: setTime(addDays(now, 4), 19, 30),
      description: "Relaxing walk in the park",
      color: "#5eead4",
    },
    {
      id: "7",
      title: "Code Review",
      start: setTime(addDays(now, 5), 9, 0),
      end: setTime(addDays(now, 5), 10, 0),
      description: "Review pull requests and provide feedback",
      color: "#f9a8d4",
    },
    {
      id: "8",
      title: "Grocery Shopping",
      start: setTime(addDays(now, 6), 10, 0),
      end: setTime(addDays(now, 6), 11, 30),
      description: "Weekly grocery run",
      color: "#6b7280",
    },
  ];
}

export function useUserActivities(initialActivities?: UserActivity[]) {
  const [activities, setActivities] = useState<UserActivity[]>(initialActivities ?? getInitialActivities());
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<UserActivity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

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

  const handleActivityDrop = (args: { activity: object; start: Date | string; end: Date | string }) => {
    const activity = args.activity as UserActivity;
    const start = typeof args.start === "string" ? new Date(args.start) : args.start;
    const end = typeof args.end === "string" ? new Date(args.end) : args.end;
    setActivities((prev) =>
      prev.map((existingActivity) =>
        existingActivity.id === activity.id ? { ...existingActivity, start, end } : existingActivity
      )
    );
  };

  const handleActivityResize = (args: { activity: object; start: Date | string; end: Date | string }) => {
    const activity = args.activity as UserActivity;
    const start = typeof args.start === "string" ? new Date(args.start) : args.start;
    const end = typeof args.end === "string" ? new Date(args.end) : args.end;
    setActivities((prev) =>
      prev.map((existingActivity) =>
        existingActivity.id === activity.id ? { ...existingActivity, start, end } : existingActivity
      )
    );
  };

  const handleSaveActivity = (activityData: Partial<UserActivity>) => {
    if (selectedActivity) {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === selectedActivity.id ? { ...activity, ...activityData } : activity
        )
      );
    } else if (selectedSlot) {
      const newActivity: UserActivity = {
        id: Date.now().toString(),
        title: activityData.title || "New Activity",
        start: selectedSlot.start,
        end: selectedSlot.end,
        description: activityData.description,
        color: activityData.color || "#3B82F6",
      };
      setActivities((prev) => [...prev, newActivity]);
    }
    setIsActivityModalOpen(false);
  };

  const handleDeleteActivity = () => {
    if (selectedActivity) {
      setActivities((prev) => prev.filter((activity) => activity.id !== selectedActivity.id));
      setIsActivityModalOpen(false);
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
  };
}
