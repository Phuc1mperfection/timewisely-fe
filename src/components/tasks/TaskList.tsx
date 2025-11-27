import { TaskItem } from "./TaskItem";
import { TaskListSkeleton } from "./TaskSkeleton";
import type { Task } from "@/interfaces";
import type { TaskListOperations } from "@/interfaces/taskOperations";

interface TaskListProps extends TaskListOperations {
  tasks: Task[];
  loading: boolean;
  emptyMessage: string;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  loading,
  emptyMessage,
}: TaskListProps) {
  if (loading) {
    return <TaskListSkeleton count={3} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Sort tasks by order before rendering
  const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
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
}