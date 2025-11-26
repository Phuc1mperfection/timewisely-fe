import { useState, useMemo } from "react";
import { Plus, ListTodo } from "lucide-react";
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
import type { Task } from "@/interfaces";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { TaskItem } from "@/components/tasks/TaskItem";
import { useTasks } from "@/hooks/useTasks";

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

export function TodayTasksPage() {
  const {
    tasks,
    loading,
    createTask: createTaskAPI,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
  } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
