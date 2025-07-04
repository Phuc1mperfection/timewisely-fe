import React from "react";
import type { Activity } from "@/interfaces/Activity";
import { cn } from "@/lib/utils";

export const CustomActivityCard = React.memo(function CustomActivityCard({
  activity,
}: { activity: Activity }) {
  return (
    <div
      className={cn(
        "cursor-pointer flex flex-col bg-transparent",
        activity.completed && "opacity-50 line-through"
      )}
      role="button"
      tabIndex={0}
    >
      <span className="font-semibold truncate" title={activity.title}>
        {activity.title}
      </span>
    </div>
  );
});
