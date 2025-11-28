import { useState, useMemo } from "react";
import { Plus, Inbox } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { startOfToday } from "date-fns";
import type { Task } from "@/interfaces";
import { TaskInlineAddForm } from "@/components/tasks/TaskInlineAddForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { useTaskDragAndDrop } from "@/hooks/useTaskDragAndDrop";

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
  const [isAddingTask, setIsAddingTask] = useState(false);

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
    setIsAddingTask(false);
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={inboxTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <TaskList
              tasks={inboxTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={loading}
              emptyMessage="No tasks in your inbox yet. Add some tasks to get started!"
            />
          </SortableContext>
        </DndContext>

        {/* Add Task Section */}
        <div className="mt-4">
          {isAddingTask ? (
            <TaskInlineAddForm
              defaultDate={startOfToday()}
              onSubmit={(taskData) => {
                handleCreateTask({ ...taskData, order: 0 });
                setIsAddingTask(false);
              }}
              onCancel={() => setIsAddingTask(false)}
            />
          ) : (
            <button
              onClick={() => setIsAddingTask(true)}
              className="w-full p-3 text-left text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2 group"
            >
              <Plus className="w-4 h-4 text-yellow-600 group-hover:text-yellow-700" />
              <span className="text-sm">Add task</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
