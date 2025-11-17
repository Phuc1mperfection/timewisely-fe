import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import type { Task } from "@/interfaces";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["pomodoro", "todo", "both"]),
  estimatedPomodoros: z
    .number()
    .min(0.1)
    .max(20)
    .refine((val) => {
      // Allow decimals 0.1-0.9 (step 0.1) and integers 1-20
      if (val < 1) {
        return val === Math.round(val * 10) / 10; // Check if it's a 0.1 step decimal
      }
      return val === Math.round(val); // Check if it's an integer
    }, "Estimated pomodoros must be in 0.1 increments (0.1-0.9) or whole numbers (1-20)"),
  priority: z.enum(["low", "medium", "high"]),
  category: z.enum([
    "work",
    "personal",
    "study",
    "fitness",
    "health",
    "shopping",
    "learning",
    "social",
    "other",
  ]),
  dueDate: z.date(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (
    task: Omit<Task, "id" | "completedPomodoros" | "completed" | "createdAt">
  ) => void;
  onCancel: () => void;
  initialValues?: Partial<TaskFormData>;
  submitLabel?: string;
}

export function TaskForm({
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const [estimatedPomodorosValue, setEstimatedPomodorosValue] = useState(
    initialValues?.estimatedPomodoros || 1
  );

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      type: initialValues?.type || "both",
      estimatedPomodoros: initialValues?.estimatedPomodoros || 1,
      priority: initialValues?.priority || "medium",
      category: initialValues?.category || "work",
      dueDate: initialValues?.dueDate || new Date(),
    },
  });

  // Update local state when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues?.estimatedPomodoros) {
      setEstimatedPomodorosValue(initialValues.estimatedPomodoros);
    }
  }, [initialValues?.estimatedPomodoros]);

  const handleEstimatedPomodorosBlur = (value: number) => {
    let finalValue;

    if (isNaN(value) || value < 0.1) {
      finalValue = 0.1;
    } else if (value < 1) {
      // Micro-tasks: 0.1-0.9 (decimal with 0.1 steps)
      finalValue = Math.round(value * 10) / 10;
    } else {
      // Real tasks: whole numbers only
      finalValue = Math.round(value);
    }

    // Ensure max limit after rounding
    finalValue = Math.min(finalValue, 20);

    setEstimatedPomodorosValue(finalValue);
    form.setValue("estimatedPomodoros", finalValue);
  };

  const handleSubmit = (data: TaskFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || "",
      type: data.type,
      estimatedPomodoros: data.estimatedPomodoros,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add task details..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pomodoro">Pomodoro Only</SelectItem>
                    <SelectItem value="todo">Todo Only</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedPomodoros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Pomodoros</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={estimatedPomodorosValue}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setEstimatedPomodorosValue(value);
                      field.onChange(value);
                    }}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      handleEstimatedPomodorosBlur(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">🟢 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="personal">👤 Personal</SelectItem>
                    <SelectItem value="study">📚 Study</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="health">❤️ Health</SelectItem>
                    <SelectItem value="shopping">🛒 Shopping</SelectItem>
                    <SelectItem value="other">📋 Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
