import apiClient from './apiClient';

export type SurveyData = Record<string, unknown>;

export const completeOnboarding = async (surveyData: SurveyData) => {
  // Gửi survey lên backend với key answers
  await apiClient.post('/onboarding/complete', { answers: surveyData });
};

export const fetchSurveyQuestions = async () => {
  const res = await apiClient.get('/onboarding/questions');
  return res.data;
};