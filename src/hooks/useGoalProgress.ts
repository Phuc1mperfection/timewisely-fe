import { useState, useEffect, useCallback } from "react";
import type { PeriodFilter, GoalProgressSummary } from "@/interfaces/Goal";
import { getGoalProgress } from "@/services/goalServices";

export function useGoalProgress(period: PeriodFilter = "week") {
  const [data, setData] = useState<GoalProgressSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchGoalProgress = useCallback(async () => {
    try {
      setIsFetching(true);
      setIsError(false);
      const response = await getGoalProgress(period);
      setData(response);
    } catch (err) {
      console.error("Failed to fetch goal progress:", err);
      setIsError(true);
      // Don't show toast to avoid dependency issues
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [period]); // Only depend on period, not handleError

  // Fetch on mount and when period changes
  useEffect(() => {
    setIsLoading(true);
    fetchGoalProgress();
  }, [fetchGoalProgress]);

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchGoalProgress();
  }, [fetchGoalProgress]);

  return {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  };
}
