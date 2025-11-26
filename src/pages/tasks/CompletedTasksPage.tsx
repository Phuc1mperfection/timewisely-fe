import { useState, useMemo } from "react";
import { CheckCircle } from "lucide-react";
import type { Task } from "@/interfaces";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { TaskItem } from "@/components/tasks/TaskItem";
import { useTasks } from "@/hooks/useTasks";

export function CompletedTasksPage() {
  const {
    tasks,
    loading,
    toggleComplete,
    deleteTask: deleteTaskAPI,
  } = useTasks();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Filter completed tasks only
  const completedTasks = useMemo(() => {
    return tasks.filter((task) => task.completed);
  }, [tasks]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-primary" />
            Completed Tasks
          </h1>
          <p className="text-muted-foreground">
            Review your accomplishments and celebrate your progress
          </p>
        </div>

        {/* Completed Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <TaskListSkeleton count={5} />
          ) : completedTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-muted-foreground text-lg">
                No completed tasks yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete some tasks to see them here
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border shadow-sm divide-y divide-border/50">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

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
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Task Name
                        </p>
                        <p className="font-medium">{task.name}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Description
                        </p>
                        <p>{task.description || "No description"}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">
                          Completed Date
                        </p>
                        <p>{new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => setEditingTaskId(null)}
                          className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={async () => {
                            // Mark as incomplete
                            await toggleComplete(task.id);
                            setEditingTaskId(null);
                          }}
                          className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                        >
                          Mark Incomplete
                        </button>
                      </div>
                    </div>
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
