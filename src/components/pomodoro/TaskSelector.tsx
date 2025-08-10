import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Target,  } from 'lucide-react';

interface TaskSelectorProps {
  selectedTask: string;
  onTaskSelect: (task: string) => void;
  customTask: string;
  onCustomTaskChange: (task: string) => void;
}

const commonTasks = [
  'Deep Work',
  'Study Session',
  'Writing',
  'Reading',
  'Coding',
  'Planning',
  'Research',
  'Design Work'
];

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedTask,
  onTaskSelect,
  customTask,
  onCustomTaskChange
}) => {
  const handleTaskClick = (task: string) => {
    if (selectedTask === task) {
      onTaskSelect('');
    } else {
      onTaskSelect(task);
      onCustomTaskChange('');
    }
  };

  const handleCustomTaskChange = (value: string) => {
    onCustomTaskChange(value);
    if (value) {
      onTaskSelect('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Select Your Focus Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Task Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Task</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your task..."
              value={customTask}
              onChange={(e) => handleCustomTaskChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Quick Task Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {commonTasks.map((task) => (
              <Button
                key={task}
                variant={selectedTask === task ? "default" : "outline"}
                size="sm"
                onClick={() => handleTaskClick(task)}
                className="transition-all duration-200"
              >
                {task}
                {selectedTask === task && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Task Display */}
        {(selectedTask || customTask) && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground">Selected Task:</div>
            <div className="font-medium text-primary">
              {customTask || selectedTask}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};