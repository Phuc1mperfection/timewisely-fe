import type { Task } from "@/interfaces/Task";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskEditForm } from "@/components/tasks/TaskEditForm";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (updates: Partial<Task>) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <TaskEditForm
        task={task}
        onSave={(updates) => {
          onEdit(updates);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        "hover:bg-accent",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={onToggle}
        className="rounded-full"
      />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-foreground",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.name}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isHovered && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "#ef4444" }}
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
