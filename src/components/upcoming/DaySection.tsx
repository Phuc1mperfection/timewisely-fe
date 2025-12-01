import { memo } from "react";
import { isToday, format } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { cn } from "@/lib/utils";

interface DaySectionProps {
  date: Date | null;
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (taskData: Omit<TaskFormData, "order">) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => void;
  isOverdueSection?: boolean;
}

export const DaySection = memo(
  function DaySection({
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

    // Make this section droppable (except overdue)
    const { setNodeRef, isOver } = useDroppable({
      id: sectionId,
      disabled: isOverdueSection,
    });

    return (
      <div
        ref={setNodeRef}
        id={sectionId}
                className={cn(
          "mt-8 first:mt-6 transition-colors rounded-lg",
          isOver && !isOverdueSection && "bg-muted/50 ring-2 ring-primary/20"
        )}
      >
        <DayHeader date={date} isOverdueSection={isOverdueSection} />

        <div className="space-y-1 mt-3 min-h-[60px]">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskList
              tasks={tasks}
              onToggleComplete={onTaskToggle}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              loading={false}
              emptyMessage=""
              enableDragAndDrop={false}
            />
          </SortableContext>

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
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo optimization
    // Only re-render if tasks array changes or key props change
    return (
      prevProps.tasks.length === nextProps.tasks.length &&
      prevProps.tasks.every(
        (task, index) =>
          task.id === nextProps.tasks[index]?.id &&
          task.completed === nextProps.tasks[index]?.completed &&
          task.name === nextProps.tasks[index]?.name
      ) &&
      prevProps.date?.getTime() === nextProps.date?.getTime() &&
      prevProps.isOverdueSection === nextProps.isOverdueSection
    );
  }
);
