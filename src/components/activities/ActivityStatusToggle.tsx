import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ActivityStatusToggleProps {
  activityId: string;
  completed: boolean;
  onToggle: (activityId: string) => void;
}

export const ActivityStatusToggle: React.FC<ActivityStatusToggleProps> = ({ 
  activityId, 
  completed, 
  onToggle 
}) => {
  return (
    <Checkbox
      checked={completed}
      onCheckedChange={() => onToggle(activityId)}
      className="data-[state=checked]:bg-wisely-purple data-[state=checked]:border-wisely-purple"
    />
  );
};