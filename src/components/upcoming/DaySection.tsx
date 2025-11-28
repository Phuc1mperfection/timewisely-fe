import { memo } from "react";
import { isToday, format } from "date-fns";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { DayHeader } from "./DayHeader";
import { TaskItem } from "./TaskItem";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
        <DndContext
          sensors={[]}
          collisionDetection={closestCenter}
          onDragEnd={() => {}}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onTaskToggle(task.id)}
                onDelete={() => onTaskDelete(task.id)}
                onEdit={(updates) => onTaskEdit(task.id, updates)}
              />
            ))}
          </SortableContext>
        </DndContext>

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
