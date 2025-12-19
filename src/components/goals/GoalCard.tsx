import { Sparkles, MoreVertical, Edit, Trash2 } from "lucide-react";
import type { PersonalGoal } from "@/interfaces/Goal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GoalCardProps {
  goal: PersonalGoal;
  onEdit?: (goal: PersonalGoal) => void;
  onDelete?: (goalId: string) => void;
}

const goalConfig: Record<
  string,
  { emoji: string; colorClass: string; bgClass: string }
> = {
  "Health & Fitness": {
    emoji: "💪",
    colorClass: "text-goal-fitness",
    bgClass: "bg-goal-fitness/10 hover:bg-goal-fitness/20",
  },
  "Focus & Productivity": {
    emoji: "🧠",
    colorClass: "text-goal-productivity",
    bgClass: "bg-goal-productivity/10 hover:bg-goal-productivity/20",
  },
  "Work-Life Balance": {
    emoji: "😌",
    colorClass: "text-goal-balance",
    bgClass: "bg-goal-balance/10 hover:bg-goal-balance/20",
  },
  "Learning & Growth": {
    emoji: "📚",
    colorClass: "text-goal-learning",
    bgClass: "bg-goal-learning/10 hover:bg-goal-learning/20",
  },
};

const defaultConfig = {
  emoji: "🎯",
  colorClass: "text-goal",
  bgClass: "bg-goal/10 hover:bg-goal/20",
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const config = goalConfig[goal.category] || defaultConfig;
  const isComplete = (goal.progressPercent || 0) >= 100;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FREQUENCY":
        return "Frequency";
      case "DURATION":
        return "Duration";
      case "COUNT":
        return "Count";
      default:
        return "Goal";
    }
  };

  return (
    <Card
      className={`${config.bgClass} backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-lg group`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.emoji}</span>
            <div>
              <h4 className="font-semibold text-foreground">{goal.title}</h4>
              <p className="text-sm text-muted-foreground">
                {goal.currentValue || 0}/{goal.targetValue} {goal.unit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <Badge
                variant={
                  (goal.progressPercent || 0) >= 70 ? "default" : "secondary"
                }
                className={`${
                  (goal.progressPercent || 0) >= 70
                    ? "bg-progress-high text-foreground"
                    : ""
                } font-semibold`}
              >
                {Math.round(goal.progressPercent || 0)}%
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {getTypeLabel(goal.type)}
              </p>
            </div>

            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(goal)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Goal
                    </DropdownMenuItem>
                  )}
                  {onDelete && goal.id && (
                    <DropdownMenuItem
                      onClick={() => onDelete(goal.id!)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Goal
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {goal.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="relative">
          <Progress
            value={goal.progressPercent || 0}
            className="h-2 bg-muted"
          />

          {/* Celebration for 100% */}
          {isComplete && (
            <div className="absolute -right-1 -top-1">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
