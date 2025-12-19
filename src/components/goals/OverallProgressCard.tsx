import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { OverallGoalProgress } from "@/interfaces/Goal";

interface OverallProgressCardProps {
  overall: OverallGoalProgress;
}

export function OverallProgressCard({ overall }: OverallProgressCardProps) {
  const getProgressColor = (percent: number): string => {
    if (percent >= 70) return "hsl(var(--progress-high))";
    if (percent >= 30) return "hsl(var(--progress-medium))";
    return "hsl(var(--progress-low))";
  };

  const getProgressGradient = (percent: number): string => {
    if (percent >= 70) return "from-emerald-500 to-teal-400";
    if (percent >= 30) return "from-amber-500 to-yellow-400";
    return "from-rose-500 to-red-400";
  };

  const percent = overall.averageProgress;
  const progressColor = getProgressColor(percent);
  const gradientClass = getProgressGradient(percent);
  const isComplete = percent >= 100;

  const chartData = [
    { name: "completed", value: percent },
    { name: "remaining", value: Math.max(0, 100 - percent) },
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={progressColor}
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor={progressColor}
                      stopOpacity={0.7}
                    />
                  </linearGradient>
                </defs>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="url(#progressGradient)" />
                  <Cell fill="#f2f2f2" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
              >
                {Math.round(percent)}%
              </span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>

            {/* Celebration effect for 100% */}
            {isComplete && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Overall Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Average goal completion rate
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {overall.completedGoals}
              </span>
              <span className="text-lg text-muted-foreground">
                / {overall.totalGoals}
              </span>
              <span className="text-sm text-muted-foreground">
                goals completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                style={{ width: `${Math.min(percent, 100)}%` }}
                className={`h-full bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-500`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
