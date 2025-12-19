import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useGoalProgress } from "@/hooks/useGoalProgress";
import type { PeriodFilter, PersonalGoal } from "@/interfaces/Goal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OverallProgressCard } from "./OverallProgressCard";
import { GoalCard } from "./GoalCard";
import { PeriodSelector } from "./PeriodSelector";
import { EmptyGoalsState } from "./EmptyGoalsState";

interface GoalProgressDashboardProps {
  onRefresh?: () => void;
  onCreateGoal?: () => void;
  onEditGoal?: (goal: PersonalGoal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export function GoalProgressDashboard({
  onRefresh,
  onCreateGoal,
  onEditGoal,
  onDeleteGoal,
}: GoalProgressDashboardProps = {}) {
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const { data, isError, refetch, isFetching } =
    useGoalProgress(period);

  const handleRefetch = () => {
    refetch();
    onRefresh?.();
  };



  if (isError) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-destructive text-lg">
            Failed to load goal progress
          </p>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const goals = data?.goals || [];
  const overall = data?.overall || {
    totalGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
  };
  const hasGoals = goals.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Personal Goals</h2>
          <p className="text-sm text-muted-foreground">
            Track your progress towards your targets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector period={period} onPeriodChange={setPeriod} />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefetch}
            disabled={isFetching}
            className="h-9 w-9"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {!hasGoals ? (
        <EmptyGoalsState onCreateGoal={onCreateGoal} />
      ) : (
        <div className="space-y-6">
          {/* Overall Progress */}
          <OverallProgressCard overall={overall} />

          {/* Goal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id || goal.title}
                goal={goal}
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


