export type PeriodFilter = "week" | "month";

export type GoalType = "FREQUENCY" | "DURATION" | "COUNT";

export interface PersonalGoal {
  id?: string;
  title: string; // "Học tiếng Anh", "Chạy bộ"
  description: string;
  type: GoalType; // "FREQUENCY" | "DURATION" | "COUNT"
  targetValue: number; // 3 (lần/tuần), 30 (km), 2 (giờ/ngày)
  currentValue?: number;
  progressPercent?: number;
  unit: string; // "times/week", "km/week", "hours/day"
  category: string; // "Learning & Growth", "Health & Fitness"
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  linkedToPomodoro?: boolean; // Auto-track from Pomodoro sessions
}

export interface GoalRequest {
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  unit: string;
  category: string;
  startDate: string;
  endDate?: string;
  linkedToPomodoro?: boolean;
}

export interface OverallGoalProgress {
  totalGoals: number;
  completedGoals: number;
  averageProgress: number;
}

export interface GoalProgressSummary {
  period: string;
  overall: OverallGoalProgress;
  goals: PersonalGoal[];
}
