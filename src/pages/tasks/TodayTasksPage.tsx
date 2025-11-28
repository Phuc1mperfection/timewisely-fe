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
import { startOfToday } from "date-fns";
import type { Task } from "@/interfaces";
import { TaskInlineAddForm } from "@/components/tasks/TaskInlineAddForm";
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
  onCreateTask: (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
}

function TaskListView({
  activeTasks,
  loading,
  isAddingTask,
  setIsAddingTask,
  onCreateTask,
  onToggleComplete,
  onEdit,
  onDelete,
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
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-muted-foreground">No tasks for today</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first task below
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

      {/* Add Task Section */}
      <div className="mt-4">
        {isAddingTask ? (
          <TaskInlineAddForm
            defaultDate={startOfToday()}
            onSubmit={(taskData) => {
              onCreateTask({ ...taskData, order: 0 });
              setIsAddingTask(false);
            }}
            onCancel={() => setIsAddingTask(false)}
          />
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full p-3 text-left text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2 group"
          >
            <Plus className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            <span className="text-sm">Add task</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function TodayTasksPage() {
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

  // Filter tasks for today only
  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
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
            <ListTodo className="w-8 h-8 text-primary" />
            Today's Tasks
          </h1>
          <p className="text-muted-foreground">Focus on what matters today</p>
        </div>

        {/* Task List */}
        <TaskListView
          tasks={filteredTasks}
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          loading={loading}
          isAddingTask={isAddingTask}
          setIsAddingTask={setIsAddingTask}
          onCreateTask={handleCreateTask}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          sensors={sensors}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}
