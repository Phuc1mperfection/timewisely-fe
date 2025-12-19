import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  clampPomodoroEstimate,
  validatePomodoroEstimate,
} from "@/lib/taskUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getUserGoals } from "@/services/goalServices";
import type { PersonalGoal } from "@/interfaces/Goal";
import type { Task } from "@/interfaces";
import type { UserSettings } from "@/services/pomodoroServices";

interface TaskEditDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    taskId: string,
    name: string,
    estimatedPomodoros: number,
    goalCategory?: string
  ) => void;
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
  const [userGoals, setUserGoals] = useState<PersonalGoal[]>([]);
  const [goalCategory, setGoalCategory] = useState<string>("");

  // Fetch user goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goals = await getUserGoals();
        setUserGoals(goals);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
    };
    fetchGoals();
  }, []);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setEditName(task.name);
      setEditEstimate(task.estimatedPomodoros || 1);
      setGoalCategory(task.goalCategory || "");
    }
  }, [task]);

  const handleSave = () => {
    if (task && editName.trim()) {
      onSave(task.id, editName.trim(), editEstimate, goalCategory || undefined);
      onClose();
    }
  };

  const handleEstimateChange = (value: string) => {
    setEditEstimate(clampPomodoroEstimate(value));
  };

  const handleEstimateBlur = (value: string) => {
    setEditEstimate(validatePomodoroEstimate(value));
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
            <Label htmlFor="edit-goal">Linked Goal (Optional)</Label>
            <Select
              value={goalCategory || "none"}
              onValueChange={(v) => setGoalCategory(v === "none" ? "" : v)}
            >
              <SelectTrigger id="edit-goal">
                <SelectValue placeholder="🎯 No Goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">🚫 No Goal</SelectItem>
                {userGoals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.category}>
                    🎯 {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Completed Pomodoro sessions will count towards this goal's
              progress
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
