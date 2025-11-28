import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/interfaces/Task";

interface TaskEditFormProps {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onCancel: () => void;
}

export function TaskEditForm({ task, onSave, onCancel }: TaskEditFormProps) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [showMore, setShowMore] = useState(false);

  // Optional fields
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(
    task.estimatedPomodoros?.toString() || ""
  );
  const [dueDate, setDueDate] = useState<Date>(new Date(task.dueDate));

  const handleSave = () => {
    if (name.trim()) {
      const updates: Partial<Task> = {
        name: name.trim(),
        description: description.trim() || undefined,
      };

      if (showMore) {
        updates.priority = priority;
        updates.category = category;
        updates.estimatedPomodoros = estimatedPomodoros
          ? parseFloat(estimatedPomodoros)
          : undefined;
        updates.dueDate = dueDate;
      }

      onSave(updates);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="px-3 py-2 space-y-2 bg-accent/50 rounded-md">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task name"
        className="font-medium"
        autoFocus
      />

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Description (optional)"
        className="text-sm resize-none"
        rows={2}
      />

      {/* Show More Toggle */}
      <button
        onClick={() => setShowMore(!showMore)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {showMore ? (
          <>
            <ChevronUp className="h-3 w-3" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3" />
            Show more
          </>
        )}
      </button>

      {/* Optional Fields */}
      {showMore && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as Task["priority"])
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as Task["category"])
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Estimated Pomodoros */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Est. Pomodoros
              </label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                max="20"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 2"
                className="h-8 text-sm"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-8 w-full justify-start text-left font-normal text-sm",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!name.trim()}
          style={{ backgroundColor: "var(--wisely-gold)" }}
          className="h-7"
        >
          <Check className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-7">
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          {navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"}+Enter to save
        </span>
      </div>
    </div>
  );
}
