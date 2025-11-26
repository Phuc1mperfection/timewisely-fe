import React, { useState } from "react";
import type { Activity } from "@/interfaces/Activity";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export const CustomActivityCard = React.memo(function CustomActivityCard({
  activity,
  onToggleCompleted,
}: {
  activity: Activity;
  onToggleCompleted?: (activity: Activity) => void;
}) {
  const isTask = activity.type === "task";

  return (
    <div
      className={cn(
        "cursor-pointer flex flex-col bg-transparent",
        activity.completed && "opacity-50 line-through"
      )}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        {isTask && (
          <Checkbox
            checked={activity.completed}
            onCheckedChange={(checked) => onToggleCompleted?.(activity)}
            className="w-4 h-4"
          />
        )}
        <span className="font-semibold truncate" title={activity.title}>
          {activity.title}
        </span>
      </div>
    </div>
  );
});
