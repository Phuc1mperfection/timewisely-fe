import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import {
  createCleanDate,
  clampPomodoroEstimate,
  validatePomodoroEstimate,
} from "@/lib/taskUtils";
import type { Task, Priority, Category, TaskType } from "@/interfaces/Task";

interface TaskEditFormProps {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onCancel: () => void;
}

const PRIORITY_COLORS = {
  low: "text-blue-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

const PRIORITY_LABELS = {
  low: "P4",
  medium: "P3",
  high: "P2",
  urgent: "P1",
};

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [type, setType] = useState<TaskType>(task.type);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    String(task.estimatedPomodoros || 1)
  );
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState<Category>(task.category);
  const [dueDate, setDueDate] = useState<Date>(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.max(44, textareaRef.current.scrollHeight) + "px";
    }
  }, [name]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      type,
      estimatedPomodoros: parseFloat(estimatedPomodoros) || 1,
      priority,
      category,
      dueDate,
    });
  };

  return (
    <div className="border rounded-lg p-3 bg-card shadow-sm space-y-3">
      {/* Task Name Input */}
      <Textarea
        ref={textareaRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task name"
        className="min-h-[44px] max-h-[200px] resize-none border-0 focus-visible:ring-0 px-0 text-base leading-relaxed"
        autoFocus
      />

      {/* Description Input */}
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="min-h-[60px] max-h-[120px] resize-none text-sm"
        rows={2}
      />

      {/* Secondary Fields Row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Due Date Chip */}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-7 text-xs gap-1 px-2",
                dueDate &&
                  "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800"
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {format(dueDate, "MMM d")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                if (date) {
                  setDueDate(createCleanDate(date));
                  setShowDatePicker(false);
                }
              }}
              disabled={(date) => isBefore(startOfDay(date), startOfToday())}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Priority Selector */}
        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as Priority)}
        >
          <SelectTrigger className="h-7 w-16 text-xs px-2 border-none shadow-none">
            <SelectValue>
              <span className={cn("font-semibold", PRIORITY_COLORS[priority])}>
                {PRIORITY_LABELS[priority]}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">
              <span className={cn("font-semibold", PRIORITY_COLORS.urgent)}>
                P1 Urgent
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className={cn("font-semibold", PRIORITY_COLORS.high)}>
                P2 High
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className={cn("font-semibold", PRIORITY_COLORS.medium)}>
                P3 Medium
              </span>
            </SelectItem>
            <SelectItem value="low">
              <span className={cn("font-semibold", PRIORITY_COLORS.low)}>
                P4 Low
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Category Dropdown */}
        <Select
          value={category}
          onValueChange={(v) => setCategory(v as Category)}
        >
          <SelectTrigger className="h-7 w-28 text-xs px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">💼 Work</SelectItem>
            <SelectItem value="personal">👤 Personal</SelectItem>
            <SelectItem value="study">📚 Study</SelectItem>
            <SelectItem value="health">❤️ Health</SelectItem>
            <SelectItem value="shopping">🛒 Shopping</SelectItem>
            <SelectItem value="learning">🎓 Learning</SelectItem>
            <SelectItem value="social">👥 Social</SelectItem>
            <SelectItem value="other">📋 Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Task Type Dropdown */}
        <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
          <SelectTrigger className="h-7 w-24 text-xs px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">🔄 Both</SelectItem>
            <SelectItem value="todo">✓ To-Do</SelectItem>
            <SelectItem value="pomodoro">🍅 Pomodoro</SelectItem>
          </SelectContent>
        </Select>

        {/* Estimated Pomodoros */}
        <div className="flex items-center gap-1.5 border rounded px-2 h-7">
          <span className="text-sm">🍅</span>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="20"
            value={estimatedPomodoros}
            onChange={(e) =>
              setEstimatedPomodoros(
                String(clampPomodoroEstimate(e.target.value))
              )
            }
            onBlur={(e) =>
              setEstimatedPomodoros(
                String(validatePomodoroEstimate(e.target.value))
              )
            }
            className="w-12 text-xs bg-transparent border-none outline-none text-center [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex gap-2 justify-end pt-1 border-t">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 text-xs"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!name.trim()}
          size="sm"
          className="h-8 text-xs bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
