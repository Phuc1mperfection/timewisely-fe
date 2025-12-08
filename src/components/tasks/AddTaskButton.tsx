import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskInlineAddForm } from "@/components/tasks/TaskInlineAddForm";
import type { Task } from "@/interfaces";

interface AddTaskButtonProps {
  defaultDate?: Date;
  context?: "pomodoro" | "todo"; // Context for smart defaults
  onCreateTask: (
    taskData: Omit<
      Task,
      "id" | "completedPomodoros" | "completed" | "createdAt" | "order"
    >
  ) => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  defaultDate,
  context = "todo", // Default to todo context
  onCreateTask,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);

  return (
    <div className="mt-4">
      {isAddingTask ? (
        <TaskInlineAddForm
          defaultDate={defaultDate}
          context={context}
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
  );
};
