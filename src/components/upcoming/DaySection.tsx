import { useState } from "react";
import { Plus } from "lucide-react";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskItem } from "./TaskItem";
import { TaskInlineAddForm } from "@/components/tasks/TaskInlineAddForm";
import { isToday, format } from "date-fns";
import { memo } from "react";

interface DaySectionProps {
  date: Date;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (taskData: Omit<TaskFormData, "order">) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
}

export const DaySection = memo(function DaySection({
  date,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onTaskEdit,
}: DaySectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const isTodaySection = isToday(date);
  const sectionId = `day-section-${format(date, "yyyy-MM-dd")}`;

  return (
    <div
      id={isTodaySection ? "today-section" : sectionId}
      className="mt-8 first:mt-6"
    >
      <DayHeader date={date} />

      <div className="space-y-1 mt-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onTaskToggle(task.id)}
            onDelete={() => onTaskDelete(task.id)}
            onEdit={(updates) => onTaskEdit(task.id, updates)}
          />
        ))}

        {/* Add Task Section */}
        {isAdding ? (
          <div className="mt-2">
            <TaskInlineAddForm
              defaultDate={date}
              onSubmit={(taskData) => {
                onTaskAdd(taskData);
                setIsAdding(false);
              }}
              onCancel={() => setIsAdding(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full p-2 text-left text-muted-foreground hover:cursor-pointer rounded-lg transition-colors flex items-center gap-2 group mt-1"
          >
            <Plus className="w-4 h-4 text-yellow-600 group-hover:text-yellow-700" />
            <span className="text-sm">Add task</span>
          </button>
        )}
      </div>
    </div>
  );
});
