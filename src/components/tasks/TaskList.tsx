import { TaskItem } from "./TaskItem";
import { TaskListSkeleton } from "./TaskSkeleton";
import type { Task } from "@/interfaces";
import type { TaskListOperations } from "@/interfaces/taskOperations";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TaskListProps extends TaskListOperations {
  tasks: Task[];
  loading: boolean;
  emptyMessage: string;
  // Optional DND props
  enableDragAndDrop?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sensors?: Array<any>;
  onDragEnd?: (event: DragEndEvent) => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  loading,
  emptyMessage,
  enableDragAndDrop = false,
  sensors = [],
  onDragEnd,
}: TaskListProps) {
  if (loading) {
    return <TaskListSkeleton count={3} />;
  }

  if (tasks.length === 0) {
    return (
      <div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Sort tasks by order before rendering
  const sortedTasks = [...tasks].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const taskListContent = (
    <div className="divide-y divide-border/50">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );

  // Wrap with DND context if enabled
  if (enableDragAndDrop && sensors.length > 0 && onDragEnd) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={sortedTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {taskListContent}
        </SortableContext>
      </DndContext>
    );
  }

  return taskListContent;
}
