import { memo } from "react";
import { isToday, format } from "date-fns";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";

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
  const isTodaySection = isToday(date);
  const sectionId = `day-section-${format(date, "yyyy-MM-dd")}`;

  return (
    <div
      id={isTodaySection ? "today-section" : sectionId}
      className="mt-8 first:mt-6"
    >
      <DayHeader date={date} />

      <div className="space-y-1 mt-3">
        <TaskList
          tasks={tasks}
          onToggleComplete={onTaskToggle}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          loading={false}
          emptyMessage=""
          enableDragAndDrop={true}
        />

        {/* Add Task Section */}
        <AddTaskButton
          defaultDate={date}
          onCreateTask={(taskData) => {
            onTaskAdd(taskData);
          }}
        />
      </div>
    </div>
  );
});
