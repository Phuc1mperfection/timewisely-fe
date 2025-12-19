import { useState, useRef, useEffect } from "react";
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
import {
  format,
  startOfToday,
  startOfTomorrow,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  nextSunday,
  isBefore,
  startOfDay,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createCleanDate,
  clampPomodoroEstimate,
  validatePomodoroEstimate,
  cleanSmartKeywords,
} from "@/lib/taskUtils";
import { getUserGoals } from "@/services/goalServices";
import type { PersonalGoal } from "@/interfaces/Goal";
import type { Priority, Category, TaskType } from "@/interfaces";

interface TaskInlineAddFormProps {
  onSubmit: (taskData: {
    name: string;
    description: string;
    type: TaskType;
    estimatedPomodoros: number;
    priority: Priority;
    category: Category;
    dueDate: Date;
    goalCategory?: string;
  }) => void;
  onCancel: () => void;
  defaultDate?: Date;
  context?: "pomodoro" | "todo"; // Context for smart defaults
}

const PRIORITY_COLORS = {
  urgent: "text-red-500",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
};

const PRIORITY_LABELS = {
  urgent: "P1",
  high: "P2",
  medium: "P3",
  low: "P4",
};

// Smart date parsing
function parseSmartDate(text: string): Date | null {
  const lowerText = text.toLowerCase();
  const today = startOfToday();

  if (lowerText.includes("today")) return today;
  if (lowerText.includes("tomorrow") || lowerText.includes("tmr"))
    return startOfTomorrow();
  if (lowerText.includes("monday") || lowerText.includes("mon"))
    return nextMonday(today);
  if (lowerText.includes("tuesday") || lowerText.includes("tue"))
    return nextTuesday(today);
  if (lowerText.includes("wednesday") || lowerText.includes("wed"))
    return nextWednesday(today);
  if (lowerText.includes("thursday") || lowerText.includes("thu"))
    return nextThursday(today);
  if (lowerText.includes("friday") || lowerText.includes("fri"))
    return nextFriday(today);
  if (lowerText.includes("saturday") || lowerText.includes("sat"))
    return nextSaturday(today);
  if (lowerText.includes("sunday") || lowerText.includes("sun"))
    return nextSunday(today);

  return null;
}

// Smart priority parsing
function parseSmartPriority(text: string): Priority | null {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("p1") || lowerText.includes("urgent")) return "urgent";
  if (lowerText.includes("p2") || lowerText.includes("high")) return "high";
  if (lowerText.includes("p3") || lowerText.includes("medium")) return "medium";
  if (lowerText.includes("p4") || lowerText.includes("low")) return "low";

  return null;
}

export function TaskInlineAddForm({
  onSubmit,
  onCancel,
  defaultDate,
  context = "todo", // Default to todo context
}: TaskInlineAddFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>(
    context === "pomodoro" ? "POMODORO_ONLY" : "TODO_ONLY"
  );
  const [estimatedPomodoros, setEstimatedPomodoros] = useState("1");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState<Date>(createCleanDate(defaultDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userGoals, setUserGoals] = useState<PersonalGoal[]>([]);
  const [goalCategory, setGoalCategory] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goals = await getUserGoals();
        setUserGoals(goals);
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      }
    };
    fetchGoals();
  }, []);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.max(44, textareaRef.current.scrollHeight) + "px";
    }
  }, [name]);

  // Click outside to cancel (but ignore clicks on Popover/Select content)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Ignore if clicking inside form
      if (formRef.current && formRef.current.contains(target)) {
        return;
      }

      // Ignore if clicking on Popover content (rendered in Portal outside form)
      const isClickingPopover = (target as Element).closest(
        '[role="dialog"], [role="menu"], [data-radix-popper-content-wrapper]'
      );
      if (isClickingPopover) {
        return;
      }

      onCancel();
    };

    // Add a small delay to prevent immediate trigger
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setName(value);

    // Smart parsing only on last word
    const words = value.trim().split(/\s+/);
    const lastWord = words[words.length - 1];

    const smartDate = parseSmartDate(lastWord);
    if (smartDate) setDueDate(createCleanDate(smartDate));

    const smartPriority = parseSmartPriority(lastWord);
    if (smartPriority) setPriority(smartPriority);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Clean smart keywords from name
    const cleanName = cleanSmartKeywords(name);
    if (!cleanName) return; // Don't submit if only keywords were entered

    onSubmit({
      name: cleanName,
      description: description.trim(),
      type,
      estimatedPomodoros: parseFloat(estimatedPomodoros) || 1,
      priority,
      category,
      dueDate,
      goalCategory: goalCategory || undefined,
    });

  };

  return (
    <div
      ref={formRef}
      className="border rounded-lg p-3 bg-card shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Task Name Input */}
      <Textarea
        ref={textareaRef}
        value={name}
        onChange={handleNameChange}
        onKeyDown={handleKeyDown}
        placeholder="Task name"
        className="min-h-[44px] max-h-[200px] resize-none text-base leading-relaxed"
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

        <Select
          value={goalCategory || "none"}
          onValueChange={(v) => setGoalCategory(v === "none" ? "" : v)}
        >
          <SelectTrigger className="h-7 w-36 text-xs px-2">
            <SelectValue placeholder="🎯 No Goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">🚫 No Goal</SelectItem>
            {userGoals.map((goal) => (
              <SelectItem key={goal.id} value={goal.category}>
                🎯 {goal.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Task Type Dropdown */}
        <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
          <SelectTrigger className="h-7 w-32 text-xs px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODO_ONLY">
              <span className="flex items-center gap-1">
                ✓ <span>Todo Only</span>
              </span>
            </SelectItem>
            <SelectItem value="POMODORO_ONLY">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🍅</span>
                <span>Pomodoro Only</span>
              </span>
            </SelectItem>
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
          onClick={handleSubmit}
          disabled={!name.trim()}
          size="sm"
          className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add task
        </Button>
      </div>
    </div>
  );
}
