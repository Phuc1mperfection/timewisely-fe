import { Target, Sparkles, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyGoalsStateProps {
  onCreateGoal?: () => void;
}

export function EmptyGoalsState({ onCreateGoal }: EmptyGoalsStateProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No goals set yet
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Create your first goal to start tracking your progress. Set targets
            like "Study English 3 times/week" or "Run 30 km/month"
          </p>
        </div>

        {onCreateGoal && (
          <Button onClick={onCreateGoal} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Goal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
