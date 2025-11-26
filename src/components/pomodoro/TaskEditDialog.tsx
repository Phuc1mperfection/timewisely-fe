import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Task } from "@/interfaces";
import type { UserSettings } from "@/services/pomodoroServices";

interface TaskEditDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, name: string, estimatedPomodoros: number) => void;
  settings: UserSettings | null;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  settings,
}) => {
  const [editName, setEditName] = useState("");
  const [editEstimate, setEditEstimate] = useState(1);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setEditName(task.name);
      setEditEstimate(task.estimatedPomodoros || 1);
    }
  }, [task]);

  const handleSave = () => {
    if (task && editName.trim()) {
      onSave(task.id, editName.trim(), editEstimate);
      onClose();
    }
  };

  const handleEstimateChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setEditEstimate(0.1);
      return;
    }
    // Only limit min/max while typing, no rounding
    setEditEstimate(Math.min(Math.max(numValue, 0.1), 20));
  };

  const handleEstimateBlur = (value: string) => {
    const numValue = parseFloat(value);
    let finalValue;

    if (isNaN(numValue) || numValue < 0.1) {
      finalValue = 0.1;
    } else if (numValue < 1) {
      // Micro-tasks: 0.1-0.9 (decimal)
      finalValue = Math.round(numValue * 10) / 10;
    } else {
      // Real tasks: whole numbers only
      finalValue = Math.round(numValue);
    }

    // Ensure max limit after rounding
    setEditEstimate(Math.min(finalValue, 20));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task name and estimated pomodoros. Actual completed pomodoros
            cannot be modified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task-name">Task Name</Label>
            <Input
              id="edit-task-name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter task name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === "Escape") {
                  onClose();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-estimated">Estimated Pomodoros</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-estimated"
                type="number"
                min="0.1"
                max="20"
                step="0.1"
                value={editEstimate}
                onChange={(e) => handleEstimateChange(e.target.value)}
                onBlur={(e) => handleEstimateBlur(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                (≈ {Math.round(editEstimate * (settings?.focusDuration || 25))}{" "}
                min)
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Micro-tasks: 0.1-0.9 • Real tasks: whole numbers only
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-completed">Actual Pomodoros (Completed)</Label>
            <Input
              id="edit-completed"
              value={task?.completedPomodoros || 0}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              This value is automatically tracked and cannot be edited manually.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!editName.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
