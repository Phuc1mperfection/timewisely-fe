import { useMemo } from "react";
import { ListTodo } from "lucide-react";
import { startOfToday } from "date-fns";
import type { Task } from "@/interfaces";
import { AddTaskButton } from "@/components/tasks/AddTaskButton";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { useTaskDragAndDrop } from "@/hooks/useTaskDragAndDrop";

export function TodayTasksPage() {
  const {
    tasks,
    loading,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
    updateTasksOrder,
    createTask: createTaskAPI,
  } = useTasks("todo"); // Only show TODO_ONLY and BOTH tasks

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

  // Use custom DnD hook with callback to update local state
  const { sensors, handleDragEnd } = useTaskDragAndDrop(
    activeTasks,
    updateTasksOrder
  );

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

  // Define a proper onCreateTask handler
  const handleCreateTask = async (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => {
    await createTaskAPI({ ...taskData, order: 0 });
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
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-muted-foreground">No tasks for today</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first task below
            </p>
          </div>
        ) : (
          <TaskList
            tasks={activeTasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            loading={false}
            emptyMessage=""
            enableDragAndDrop={true}
            sensors={sensors}
            onDragEnd={handleDragEnd}
          />
        )}

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
