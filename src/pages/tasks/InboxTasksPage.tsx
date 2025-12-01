import { useMemo } from "react";
import { Inbox } from "lucide-react";
import { startOfToday } from "date-fns";
import type { Task } from "@/interfaces";
import { useTasks } from "@/hooks/useTasks";
import { useTaskDragAndDrop } from "@/hooks/useTaskDragAndDrop";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskList } from "@/components/tasks/TaskList";

export function InboxTasksPage() {
  const {
    tasks,
    loading,
    createTask: createTaskAPI,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
    updateTasksOrder,
  } = useTasks();

  // Filter tasks that are not completed (inbox shows all incomplete tasks)
  // Don't sort here - useTasks already sorts by order
  const inboxTasks = useMemo(() => {
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  // Use custom DnD hook with callback to update local state
  const { sensors, handleDragEnd } = useTaskDragAndDrop(
    inboxTasks,
    updateTasksOrder
  );

  const handleCreateTask = async (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => {
    await createTaskAPI(taskData);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
  };

  const handleEditTask = async (id: string, updates: Partial<Task>) => {
    await updateTaskAPI(id, updates);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskAPI(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3 mb-2">
            <Inbox className="w-8 h-8 text-primary" />
            Inbox
          </h1>
          <p className="text-muted-foreground">
            All your incomplete tasks in one place
          </p>
        </div>

        {/* Task List */}
        <TaskList
          tasks={inboxTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          loading={loading}
          emptyMessage="No tasks in your inbox yet. Add some tasks to get started!"
          enableDragAndDrop={true}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        />

        {/* Add Task Section */}
        <AddTaskButton
          defaultDate={startOfToday()}
          onCreateTask={(taskData) =>
            handleCreateTask({ ...taskData, order: 0 })
          }
        />
      </div>
    </div>
  );
}
