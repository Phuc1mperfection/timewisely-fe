/**
 * Task utility functions for handling dates and pomodoro estimates
 */

/**
 * Create a clean date at 9 AM to avoid timezone issues
 * @param date - The date to clean (defaults to today)
 * @returns Date object set to 9 AM with no timezone offset issues
 */
export function createCleanDate(date?: Date): Date {
  const cleanDate = date ? new Date(date) : new Date();
  cleanDate.setHours(9, 0, 0, 0);
  return cleanDate;
}

/**
 * Create tomorrow's date at 9 AM
 * @returns Date object for tomorrow at 9 AM
 */
export function createTomorrowDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  return tomorrow;
}

/**
 * Validate and round pomodoro estimate value
 * Micro-tasks (0.1-0.9): Round to 1 decimal place
 * Real tasks (≥1): Round to whole numbers
 *
 * @param value - The input value to validate
 * @returns Validated and rounded value between 0.1 and 20
 */
export function validatePomodoroEstimate(value: string | number): number {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  let finalValue: number;

  if (isNaN(numValue) || numValue < 0.1) {
    finalValue = 0.1;
  } else if (numValue < 1) {
    // Micro-tasks: 0.1-0.9 (decimal)
    finalValue = Math.round(numValue * 10) / 10;
  } else {
    // Real tasks: whole numbers only
    finalValue = Math.round(numValue);
  }

  // Ensure max limit after rounding
  return Math.min(finalValue, 20);
}

/**
 * Clamp pomodoro value without rounding (for real-time input)
 * @param value - The input value
 * @returns Clamped value between 0.1 and 20
 */
export function clampPomodoroEstimate(value: string | number): number {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return 0.1;
  return Math.min(Math.max(numValue, 0.1), 20);
}
