import { memo } from "react";
import { isToday, format } from "date-fns";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";

interface DaySectionProps {
  date: Date | null;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (taskData: Omit<TaskFormData, "order">) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  isOverdueSection?: boolean;
}

export const DaySection = memo(function DaySection({
  date,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskDelete,
  onTaskEdit,
  isOverdueSection = false,
}: DaySectionProps) {
  const isTodaySection = date ? isToday(date) : false;
  const sectionId = date
    ? isTodaySection
      ? "today-section"
      : `day-section-${format(date, "yyyy-MM-dd")}`
    : "overdue-section";

  return (
    <div id={sectionId} className="mt-8 first:mt-6">
      <DayHeader date={date} isOverdueSection={isOverdueSection} />

      <div className="space-y-1 mt-3">
        <TaskList
          tasks={tasks}
          onToggleComplete={onTaskToggle}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          loading={false}
          emptyMessage=""
          enableDragAndDrop={!isOverdueSection}
        />

        {/* Add Task Section - only show for regular date sections */}
        {!isOverdueSection && date && (
          <AddTaskButton
            defaultDate={date}
            onCreateTask={(taskData) => {
              onTaskAdd(taskData);
            }}
          />
        )}
      </div>
    </div>
  );
});
