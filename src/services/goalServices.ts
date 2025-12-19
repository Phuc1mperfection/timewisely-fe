import apiClient from "./apiClient";
import type {
  PeriodFilter,
  GoalProgressSummary,
  PersonalGoal,
  GoalRequest,
} from "@/interfaces/Goal";

export const getGoalProgress = async (
  period: PeriodFilter
): Promise<GoalProgressSummary> => {
  const response = await apiClient.get<GoalProgressSummary>(
    `/goals/progress?period=${period}`
  );
  return response.data;
};

export const getUserGoals = async (): Promise<PersonalGoal[]> => {
  const response = await apiClient.get<PersonalGoal[]>("/goals");
  return response.data;
};

export const createGoal = async (goal: GoalRequest): Promise<PersonalGoal> => {
  const response = await apiClient.post<PersonalGoal>("/goals", goal);
  return response.data;
};

export const updateGoal = async (
  goalId: string,
  goal: GoalRequest
): Promise<PersonalGoal> => {
  const response = await apiClient.put<PersonalGoal>(`/goals/${goalId}`, goal);
  return response.data;
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await apiClient.delete(`/goals/${goalId}`);
};
