import apiClient from "./apiClient";

export type SurveyData = Record<string, unknown>;

export interface QuestionCondition {
  dependsOn: string;
  showIfEquals: string;
}

export interface SwipeCard {
  id: string;
  title: string;
  emoji: string;
  category: string;
  description: string;
  image?: string;
}

export interface SurveyQuestion {
  key: string;
  label: string;
  type: string;
  options?: string[] | null;
  cards?: SwipeCard[];
  required: boolean;
  placeholder?: string | null;
  condition?: QuestionCondition;
}

export interface SurveyResponse {
  surveyId: string;
  userId: string;
  answers: SurveyData;
  questions: SurveyQuestion[];
  version: number;
  createdAt: string;
}

export const completeOnboarding = async (surveyData: SurveyData) => {
  // Gửi survey lên backend với key answers
  await apiClient.post("/onboarding/complete", { answers: surveyData });

  // Sau khi hoàn thành onboarding, generate AI suggestions và lưu vào DB
  try {
    const { generateAISuggestions } = await import("./suggestionServices");
    await generateAISuggestions({ answers: surveyData });
    console.log("AI suggestions generated and saved to database");
  } catch (error) {
    console.error(
      "Failed to generate AI suggestions (will be available later):",
      error,
    );
    // Don't block onboarding if AI generation fails
  }
};

export const fetchSurveyQuestions = async (): Promise<SurveyQuestion[]> => {
  const res = await apiClient.get("/onboarding/questions");
  return res.data;
};

export const fetchMySurvey = async (): Promise<SurveyResponse> => {
  try {
    const res = await apiClient.get("/onboarding/survey/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    throw error;
  }
};
