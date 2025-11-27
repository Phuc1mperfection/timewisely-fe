import { useState, useMemo } from "react";
import { Plus, ListTodo } from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "@/interfaces";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { useTasks } from "@/hooks/useTasks";
import { useTaskDragAndDrop } from "@/hooks/useTaskDragAndDrop";

// TaskListView component for reuse
interface TaskListViewProps {
  tasks: Task[];
  activeTasks: Task[];
  completedTasks: Task[];
  loading: boolean;
  isAddingTask: boolean;
  setIsAddingTask: (adding: boolean) => void;
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  onCreateTask: (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onUpdateTask: (
    id: string,
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => void;
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
}

function TaskListView({
  tasks,
  activeTasks,
  completedTasks,
  loading,
  isAddingTask,
  setIsAddingTask,
  editingTaskId,
  setEditingTaskId,
  onCreateTask,
  onToggleComplete,
  onEdit,
  onDelete,
  onCancelEdit,
  onUpdateTask,
  sensors,
  handleDragEnd,
}: TaskListViewProps) {
  // Don't sort here - useTasks already sorts by order
  const sortedActiveTasks = activeTasks;

  return (
    <div className="hover:cursor-pointer">
      {/* Active Tasks */}
      <div className="hover:cursor-pointer">
        {loading ? (
          <TaskListSkeleton count={3} />
        ) : activeTasks.length === 0 && !isAddingTask ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-muted-foreground">No upcoming tasks</p>
            <p className="text-sm text-muted-foreground mt-1">
              Plan ahead and add your future tasks
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedActiveTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <TaskList
                tasks={sortedActiveTasks}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={false}
                emptyMessage=""
              />
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Inline Add Task */}
      {isAddingTask && (
        <div className="border-t border-border/50 p-4">
          <TaskForm
            onSubmit={onCreateTask}
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

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <div className="bg-card rounded-lg border shadow-sm">
            <TaskList
              tasks={completedTasks}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={false}
              emptyMessage=""
            />
          </div>
        </div>
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
                const task = tasks.find((t) => t.id === editingTaskId);
                return task ? (
                  <TaskForm
                    initialValues={{
                      name: task.name,
                      description: task.description,
                      type: task.type,
                      estimatedPomodoros: task.estimatedPomodoros,
                      priority: task.priority,
                      category: task.category,
                      dueDate: task.dueDate,
                    }}
                    onSubmit={async (taskData) => {
                      if (editingTaskId) {
                        await onUpdateTask(editingTaskId, taskData);
                        setEditingTaskId(null);
                      }
                    }}
                    onCancel={onCancelEdit}
                    submitLabel="Update Task"
                  />
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function UpcomingTasksPage() {
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

  // Filter tasks for upcoming only
  const filteredTasks = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (task.completed) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() >= tomorrow.getTime();
    });
  }, [tasks]);

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  // Use custom DnD hook with callback to update local state
  const { sensors, handleDragEnd } = useTaskDragAndDrop(
    activeTasks,
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3 mb-2">
            <ListTodo className="w-8 h-8 text-primary" />
            Upcoming Tasks
          </h1>
          <p className="text-muted-foreground">
            Plan and organize your future tasks
          </p>
        </div>

        {/* Task List */}
        <TaskListView
          tasks={filteredTasks}
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          loading={loading}
          isAddingTask={isAddingTask}
          setIsAddingTask={setIsAddingTask}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          onCreateTask={handleCreateTask}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onCancelEdit={handleCancelEdit}
          onUpdateTask={async (id, taskData) => {
            await updateTaskAPI(id, taskData);
          }}
          sensors={sensors}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}
