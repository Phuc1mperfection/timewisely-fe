import { useState, useMemo } from "react";
import { Plus, Inbox } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "@/interfaces";
import { TaskForm } from "@/components/tasks/TaskForm";
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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskAPI(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleUpdateTask = async (
    id: string,
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => {
    await updateTaskAPI(id, taskData);
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

        {/* Inline Add Task */}
        {isAddingTask && (
          <div className="border-t border-border/50 p-4">
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsAddingTask(false)}
            />
          </div>
        )}

        {/* Add Task Button */}
        {!isAddingTask && (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full p-4 text-left text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors flex items-center gap-3 group"
          >
            <Plus className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span>Add a task</span>
          </button>
        )}

        {/* Edit Task Dialog */}
        {editingTaskId && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setEditingTaskId(null)}
          >
            <div
              className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                {(() => {
                  const task = inboxTasks.find((t) => t.id === editingTaskId);
                  return task ? (
                    <TaskForm
                      initialValues={{
                        name: task.name,
                        description: task.description,
                        type: task.type,
                        estimatedPomodoros: task.estimatedPomodoros,
                        priority: task.priority,
                        category: task.category,
                        dueDate: new Date(task.dueDate),
                      }}
                      onSubmit={async (taskData) => {
                        if (editingTaskId) {
                          await handleUpdateTask(editingTaskId, taskData);
                          setEditingTaskId(null);
                        }
                      }}
                      onCancel={handleCancelEdit}
                      submitLabel="Update Task"
                    />
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
