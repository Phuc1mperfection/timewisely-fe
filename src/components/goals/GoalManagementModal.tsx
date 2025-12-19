import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createGoal, updateGoal } from "@/services/goalServices";
import type { PersonalGoal, GoalRequest, GoalType } from "@/interfaces/Goal";

interface GoalManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: PersonalGoal;
  onSuccess?: () => void;
}

const GOAL_CATEGORIES = [
  "Health & Fitness",
  "Focus & Productivity",
  "Work-Life Balance",
  "Learning & Growth",
];

const GOAL_TYPES: { value: GoalType; label: string; units: string[] }[] = [
  {
    value: "FREQUENCY",
    label: "Frequency (How many times)",
    units: ["times/week", "times/month", "sessions/week"],
  },
  {
    value: "DURATION",
    label: "Duration (How long)",
    units: ["hours/day", "hours/week", "minutes/day", "minutes/week"],
  },
  {
    value: "COUNT",
    label: "Count (How much)",
    units: ["km/week", "km/month", "pages/day", "words/day"],
  },
];

export function GoalManagementModal({
  isOpen,
  onClose,
  goal,
  onSuccess,
}: GoalManagementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<GoalType>("FREQUENCY");

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<GoalRequest>({
      defaultValues: {
        title: "",
        description: "",
        type: "FREQUENCY",
        targetValue: 3,
        unit: "times/week",
        category: "Health & Fitness",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        linkedToPomodoro: false,
      },
    });

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title,
        description: goal.description,
        type: goal.type,
        targetValue: goal.targetValue,
        unit: goal.unit,
        category: goal.category,
        startDate: goal.startDate,
        endDate: goal.endDate || "",
        linkedToPomodoro: goal.linkedToPomodoro || false,
      });
      setSelectedType(goal.type);
    } else {
      reset({
        title: "",
        description: "",
        type: "FREQUENCY",
        targetValue: 3,
        unit: "times/week",
        category: "Health & Fitness",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
      setSelectedType("FREQUENCY");
    }
  }, [goal, reset, isOpen]);

  const onSubmit = async (data: GoalRequest) => {
    try {
      setIsSubmitting(true);
      if (goal?.id) {
        await updateGoal(goal.id, data);
      } else {
        await createGoal(data);
      }
      onSuccess?.();
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save goal:", error);
      alert("Failed to save goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeConfig = GOAL_TYPES.find((t) => t.value === selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
          <DialogDescription>
            Set a target and track your progress over time
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="Crawl 30 km this month"
              {...register("title", { required: true })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What do you want to achieve?"
              rows={3}
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Goal Type */}
            <div className="space-y-2">
              <Label>Goal Type *</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value as GoalType);
                  setValue("type", value as GoalType);
                  // Set default unit for this type
                  const defaultUnit = GOAL_TYPES.find((t) => t.value === value)
                    ?.units[0];
                  if (defaultUnit) {
                    setValue("unit", defaultUnit);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={watch("category") || "Health & Fitness"}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Target Value */}
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                min="1"
                placeholder="e.g., 3, 30, 100"
                {...register("targetValue", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select
                value={watch("unit") || typeConfig?.units[0]}
                onValueChange={(value) => setValue("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeConfig?.units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: true })}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          {/* Linked to Pomodoro - Only show for DURATION or FREQUENCY */}
          {(selectedType === "DURATION" || selectedType === "FREQUENCY") && (
            <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
              <Checkbox
                id="linkedToPomodoro"
                checked={watch("linkedToPomodoro") || false}
                onCheckedChange={(checked) =>
                  setValue("linkedToPomodoro", checked as boolean)
                }
              />
              <div className="space-y-1">
                <Label
                  htmlFor="linkedToPomodoro"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Link to Pomodoro sessions
                </Label>
                <p className="text-xs text-muted-foreground">
                  Completed Pomodoro sessions will automatically count towards
                  this goal
                </p>
              </div>
            </div>
          )}

          {/* Example Preview */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Goal Preview:</p>
            <p className="text-sm text-muted-foreground">
              "{watch("title") || "Your goal"}" - Target:{" "}
              <strong>
                {watch("targetValue") || 0} {watch("unit") || "units"}
              </strong>
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : goal
                ? "Update Goal"
                : "Create Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
