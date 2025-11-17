import { useState, useMemo } from "react";
import { Plus, ListTodo } from "lucide-react";
import { motion } from "motion/react";
import type { Task, TaskFilters, SortOption, Priority } from "@/interfaces";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskFilters as FilterComponent } from "@/components/tasks/TasksFilters";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { PaginatedList } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTasks } from "@/hooks/useTasks";

export function TaskPage() {
  const {
    tasks,
    loading,
    createTask: createTaskAPI,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
  } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filters.type && task.type !== filters.type) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (
        filters.completed !== undefined &&
        task.completed !== filters.completed
      )
        return false;
      if (
        filters.search &&
        !task.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority": {
          const priorityOrder: Record<Priority, number> = {
            high: 0,
            medium: 1,
            low: 2,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, filters, sortBy]);

  const activeTasks = filteredAndSortedTasks.filter((t) => !t.completed);
  const completedTasks = filteredAndSortedTasks.filter((t) => t.completed);

  const handleCreateTask = async (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => {
    await createTaskAPI(taskData);
    setIsFormOpen(false);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleComplete(id);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt"
    >
  ) => {
    if (editingTask) {
      await updateTaskAPI(editingTask.id, taskData);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskAPI(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Render function for task cards with animation
  const renderTaskCard = (task: Task, index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <TaskCard
        task={task}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-foreground flex items-center gap-3">
              <ListTodo className="w-10 h-10 text-primary" />
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-2">
              Organize your work with pomodoro tracking
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <FilterComponent
          filters={filters}
          sortBy={sortBy}
          onFiltersChange={setFilters}
          onSortChange={setSortBy}
        />

        {/* Active Tasks */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            Active Tasks
            <span className="text-lg text-muted-foreground">
              ({activeTasks.length})
            </span>
          </h2>

          {loading ? (
            <TaskListSkeleton count={4} />
          ) : activeTasks.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border-2 border-dashed">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl text-muted-foreground">No active tasks</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a new task to get started!
              </p>
            </div>
          ) : (
            <PaginatedList
              items={activeTasks}
              itemsPerPage={4}
              renderItem={renderTaskCard}
              emptyMessage="No active tasks"
              gridClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
            />
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              Completed Tasks
              <span className="text-lg text-muted-foreground">
                ({completedTasks.length})
              </span>
            </h2>
            {loading ? (
              <TaskListSkeleton count={4} />
            ) : (
              <PaginatedList
                items={completedTasks}
                itemsPerPage={8}
                renderItem={renderTaskCard}
                emptyMessage="No completed tasks"
                gridClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-2"
              />
            )}
          </div>
        )}

        {/* Create Task Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <TaskForm
                initialValues={{
                  name: editingTask.name,
                  description: editingTask.description,
                  type: editingTask.type,
                  estimatedPomodoros: editingTask.estimatedPomodoros,
                  priority: editingTask.priority,
                  category: editingTask.category,
                  dueDate: editingTask.dueDate,
                }}
                onSubmit={handleUpdateTask}
                onCancel={handleCancelEdit}
                submitLabel="Update Task"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
