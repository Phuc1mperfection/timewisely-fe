import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ActivityStatusToggleProps {
  activityId: string;
  completed: boolean;
  onToggle: (activityId: string) => void;
}

// Memoize to prevent re-renders
export const ActivityStatusToggle = React.memo<ActivityStatusToggleProps>(
  ({ activityId, completed, onToggle }) => {
    const handleToggle = React.useCallback(() => {
      onToggle(activityId);
    }, [activityId, onToggle]);

    return (
      <Checkbox
        checked={completed}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-wisely-gold data-[state=checked]:border-wisely-gold hover:cursor-pointer"
      />
    );
  }
);
