import { useMemo, useState } from "react";
import { startOfToday } from "date-fns";
import { ListTodo, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import type { Task } from "@/interfaces";
import type { TaskFormData } from "@/interfaces/Task";
import { TaskInlineAddForm } from "@/components/tasks/TaskInlineAddForm";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { TaskItem } from "@/components/tasks/TaskItem";
import { useTasks } from "@/hooks/useTasks";

// TaskListView component for reuse across tabs
interface TaskListViewProps {
  date?: Date;
  activeTasks: Task[];
  completedTasks: Task[];
  loading: boolean;
  isAddingTask: boolean;
  setIsAddingTask: (value: boolean) => void;
  onCreateTask: (taskData: Omit<TaskFormData, "order">) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
}

function TaskListView({
  date,
  activeTasks,
  completedTasks,
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
  return (
    <div className="hover:cursor-pointer">
      {/* Active Tasks */}
      <div className="hover:cursor-pointer">
        {loading ? (
          <TaskListSkeleton count={3} />
        ) : activeTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-muted-foreground">No tasks yet</p>
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
              items={activeTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {activeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Task Section */}
      <div className="mt-4">
        {isAddingTask ? (
          <TaskInlineAddForm
            defaultDate={date}
            onSubmit={(taskData) => {
              onCreateTask(taskData);
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

      {/* Completed Tasks Section - only show in completed view */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <div className="bg-card rounded-lg border shadow-sm divide-y divide-border/50">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TaskPage() {
  const {
    tasks,
    loading,
    createTask: createTaskAPI,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
  } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Get active view from URL query param, default to "today"
  const activeView =
    (searchParams.get("view") as "today" | "upcoming" | "completed") || "today";

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks based on active view
  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (activeView) {
      case "today":
        return tasks.filter((task) => {
          if (task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      case "upcoming":
        return tasks.filter((task) => {
          if (task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() >= tomorrow.getTime();
        });
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return [];
    }
  }, [tasks, activeView]);

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = activeTasks.findIndex((task) => task.id === active.id);
      const newIndex = activeTasks.findIndex((task) => task.id === over.id);

      // Reorder the tasks array
      const reorderedTasks = arrayMove(activeTasks, oldIndex, newIndex);

      // Update order values
      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      // Here you would typically call an API to update the order on the backend
      // For now, we'll just update the local state
      console.log(
        "New order:",
        updatedTasks.map((t) => ({ id: t.id, order: t.order }))
      );
    }
  };

  const handleCreateTask = async (taskData: Omit<TaskFormData, "order">) => {
    await createTaskAPI(taskData as TaskFormData);
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

  const handleViewChange = (value: string) => {
    setSearchParams({ view: value as "today" | "upcoming" | "completed" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3 mb-2">
            <ListTodo className="w-8 h-8 text-primary" />
            Tasks
          </h1>
          <p className="text-muted-foreground">
            Stay organized and focused with your tasks
          </p>
        </div>

        {/* View Tabs */}
        <div className="mb-6">
          <Tabs value={activeView} onValueChange={handleViewChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <TaskListView
                date={startOfToday()}
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
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <TaskListView
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
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <TaskListView
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
