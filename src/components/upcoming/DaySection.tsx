import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "./AddTaskButton";
import { isToday } from "date-fns";

interface DaySectionProps {
  date: Date;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (taskData: Omit<TaskFormData, "order">) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
}

export function DaySection({
  date,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onTaskEdit,
}: DaySectionProps) {
  const isTodaySection = isToday(date);

  return (
    <div
      id={isTodaySection ? "today-section" : undefined}
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

        <AddTaskButton date={date} onAdd={onTaskAdd} />
      </div>
    </div>
  );
}
