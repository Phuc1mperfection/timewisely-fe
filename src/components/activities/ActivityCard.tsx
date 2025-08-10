import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ActivityStatusToggle } from "./ActivityStatusToggle";
import type { Activity } from "@/interfaces/Activity"; // Adjust the import path as necessary

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onToggleComplete,
}) => {
  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd");
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "border-l-blue-500";
      case "green":
        return "border-l-green-500";
      case "purple":
        return "border-l-purple-500";
      case "red":
        return "border-l-red-500";
      case "yellow":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <Card
      className={`transition-all duration-200  border-l-4 ${getColorClass(
        activity.color
      )} ${
        activity.completed
          ? "bg-gray-50 border-gray-200 opacity-75"
          : "bg-white border-gray-200 hover:border-wisely-purple/30"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <ActivityStatusToggle
                activityId={activity.id}
                completed={Boolean(activity.completed)}
                onToggle={onToggleComplete}
              />
              <h3
                className={`text-lg font-semibold ${
                  activity.completed
                    ? "text-gray-500 line-through"
                    : "text-wisely-dark"
                }`}
              >
                {activity.title}
              </h3>
                {activity.color && (
                <span
                  className="items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                  backgroundColor: activity.color,
                  color:activity.color,
                  }}
                >
                  {activity.color}
                </span>
                )}
            </div>

            {activity.description && (
              <p
                className={`text-sm mb-3 ml-9 ${
                  activity.completed ? "text-gray-400" : "text-wisely-gray"
                }`}
              >
                {activity.description}
              </p>
            )}

            <div
              className={`flex items-center gap-2 text-sm ml-9 ${
                activity.completed ? "text-gray-400" : "text-wisely-gray"
              }`}
            >
              <Clock size={16} />
              <span>
                {formatDate(activity.startTime)} •{" "}
                {formatTime(activity.startTime)} -{" "}
                {formatTime(activity.endTime)}
              </span>
            </div>
          </div>

          {activity.completed && (
            <div className="ml-4">
              <span className="items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
