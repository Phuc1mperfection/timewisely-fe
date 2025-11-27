import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskFormData } from "@/interfaces/Task";

interface AddTaskButtonProps {
  date: Date;
  onAdd: (taskData: Omit<TaskFormData, "order">) => void;
}

export function AddTaskButton({ date, onAdd }: AddTaskButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      // Create a clean date with fixed time (9 AM) to avoid timezone issues
      const cleanDate = new Date(date);
      cleanDate.setHours(9, 0, 0, 0);

      onAdd({
        name: taskName.trim(),
        description: "",
        type: "both",
        estimatedPomodoros: 1,
        priority: "medium",
        category: "personal",
        dueDate: cleanDate,
      });
      setTaskName("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTaskName("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <form onSubmit={handleSubmit} className="px-3 py-2">
        <Input
          autoFocus
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task name"
          className="mb-2"
          onBlur={handleCancel}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel();
          }}
        />
      </form>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsAdding(true)}
      className="w-full justify-start px-3 py-2 h-auto hover:bg-accent"
      style={{ color: "var(--wisely-gold)" }}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add task
    </Button>
  );
}
