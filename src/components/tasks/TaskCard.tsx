import { memo } from "react";
import { Calendar, Tag, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Task, Priority } from "@/interfaces";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const priorityConfig: Record<
  Priority,
  { color: string; icon: string; label: string }
> = {
  urgent: { color: "border-l-red-500", icon: "🔴", label: "Urgent" },
  high: { color: "border-l-orange-500", icon: "🟠", label: "High" },
  medium: { color: "border-l-yellow-500", icon: "🟡", label: "Medium" },
  low: { color: "border-l-blue-500", icon: "🔵", label: "Low" },
};

const categoryColors: Record<string, string> = {
  work: "bg-category-work",
  personal: "bg-category-personal",
  study: "bg-category-study",
  fitness: "bg-category-fitness",
  health: "bg-category-health",
  shopping: "bg-category-shopping",
  other: "bg-category-other",
};

export const TaskCard = memo(
  ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
    const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
    const priorityInfo = priorityConfig[task.priority];

    return (
      <div
        className={cn(
          "group relative bg-card rounded-lg border-l-4 p-6 transition-all duration-300",
          "hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02]",
          priorityInfo.color,
          task.completed && "opacity-60"
        )}
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className={cn(
              "mt-1 transition-transform hover:scale-110",
              task.completed &&
                "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            )}
            aria-label={`Mark ${task.name} as ${
              task.completed ? "incomplete" : "complete"
            }`}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-medium text-lg text-card-foreground transition-all",
                    task.completed && "line-through"
                  )}
                >
                  {task.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary"
                >
                  {priorityInfo.icon} {priorityInfo.label}
                </Badge>
                {(onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Task options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {task.description && (
              <p
                className={cn(
                  "text-sm text-muted-foreground mb-3",
                  task.completed && "line-through"
                )}
              >
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div
                className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive font-medium"
                )}
              >
                <Calendar className="w-4 h-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>

              <Badge
                className={cn(
                  "text-xs text-muted-foreground",
                  categoryColors[task.category]
                )}
              >
                <Tag className="w-3 h-3 mr-1" />
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </Badge>

              {(task.type === "POMODORO_ONLY" || task.type === "BOTH") && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-base">🍅</span>
                  <span>
                    {task.completedPomodoros}/{task.estimatedPomodoros}
                  </span>
                </div>
              )}

              <Badge variant="secondary" className="text-xs">
                {task.type === "POMODORO_ONLY"
                  ? "🍅 Pomodoro Only"
                  : task.type === "TODO_ONLY"
                  ? "✓ Todo Only"
                  : "🔄 Both"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";
