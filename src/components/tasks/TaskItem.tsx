import { useState } from "react";
import { CalendarIcon, Check, Edit2, Trash2, GripVertical } from "lucide-react";
import { format, isToday, isTomorrow, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/interfaces";
import { TaskEditForm } from "./TaskEditForm";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
    urgent: "bg-purple-500",
  };

  // Check if task is overdue
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    isBefore(startOfDay(new Date(task.dueDate)), startOfDay(new Date()));

  // Format due date display
  const formatDueDate = (date: Date) => {
    if (isToday(date)) {
      return format(date, "MMM d");
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "MMM d");
    }
  };

  // Show inline edit form when editing
  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="p-4 border-b border-border/50"
      >
        <TaskEditForm
          task={task}
          onSave={(updates) => {
            onEdit(task.id, updates);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group flex items-center gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors",
        task.completed && "opacity-60",
        isDragging && "opacity-50 shadow-lg z-50",
        isOverdue &&
          "bg-red-50/50 border-red-200/50 dark:bg-red-950/20 dark:border-red-800/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Circular Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className={cn(
          "w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center transition-all hover:border-primary",
          task.completed && "bg-primary border-primary"
        )}
      >
        {task.completed && (
          <Check className="w-3 h-3 text-primary-foreground" />
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.name}
          </span>
          {/* Priority Dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              priorityColors[task.priority]
            )}
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600 dark:text-red-400 font-medium"
              )}
            >
              <CalendarIcon className="w-3 h-3" />
              {formatDueDate(new Date(task.dueDate))}
            </span>
          )}
          <span className="capitalize">{task.category}</span>
          <span>{task.estimatedPomodoros} pomodoros</span>
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
