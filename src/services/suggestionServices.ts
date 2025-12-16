import apiClient from "./apiClient";

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  suggestedTime: string;
  location?: string;
  category: string;
  goalTag: string;
  reasoning: string;
  score: number;
  color: string;
}

/**
 * Get rule-based activity suggestions (no AI, no quota usage).
 *
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Array of personalized suggestions based on scoring algorithm
 */
export const getRuleBasedSuggestions = async (
  limit: number = 5
): Promise<Suggestion[]> => {
  const response = await apiClient.get(`/suggestions?limit=${limit}`);
  return response.data;
};

/**
 * Get AI-powered activity suggestions using Google Gemini.
 * May throw error if quota exceeded or AI service unavailable.
 *
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Array of AI-generated suggestions
 * @throws Error if AI quota exceeded or service unavailable
 */
export const getAISuggestions = async (
  limit: number = 5
): Promise<Suggestion[]> => {
  const response = await apiClient.get(`/suggestions/ai?limit=${limit}`);
  return response.data;
};

/**
 * @deprecated Use getRuleBasedSuggestions() or getAISuggestions() instead
 */
export const getSuggestions = getRuleBasedSuggestions;

/**
 * Accept a suggestion and add it to the user's calendar.
 *
 * @param suggestionId - UUID of the suggestion to accept
 * @param suggestionData - Full suggestion data to send to backend
 * @returns Created UserActivity object
 */
export const acceptSuggestion = async (
  suggestionId: string,
  suggestionData: Suggestion
): Promise<{ id: string }> => {
  const response = await apiClient.post(
    `/suggestions/${suggestionId}/accept`,
    suggestionData
  );
  return response.data;
};

/**
 * Refresh suggestions to get new recommendations.
 * Useful after completing activities or updating preferences.
 *
 * @param limit - Maximum number of suggestions to return (default: 5)
 * @returns Array of refreshed suggestions
 */
export const refreshSuggestions = async (
  limit: number = 5
): Promise<Suggestion[]> => {
  const response = await apiClient.post(`/suggestions/refresh?limit=${limit}`);
  return response.data;
};
