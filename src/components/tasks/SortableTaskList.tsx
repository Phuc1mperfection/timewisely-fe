/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskList } from "@/components/tasks/TaskList";
import type { Task } from "@/interfaces";

interface SortableTaskListProps {
  tasks: Task[];
  sensors: any;
  onDragEnd: (event: any) => void;
  onToggleComplete: (id: string) => Promise<void>;
  onEdit: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
  emptyMessage: string;
}

export const SortableTaskList: React.FC<SortableTaskListProps> = ({
  tasks,
  sensors,
  onDragEnd,
  onToggleComplete,
  onEdit,
  onDelete,
  loading,
  emptyMessage,
}) => {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
          emptyMessage={emptyMessage}
        />
      </SortableContext>
    </DndContext>
  );
};
