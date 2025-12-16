import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
// No icon imports needed
import { useToast } from "@/hooks/useToast";
import {
  fetchSurveyQuestions,
  completeOnboarding,
} from "@/services/onboardingservices";
import type { SurveyData } from "@/services/onboardingservices";
import { useAuth } from "@/contexts/useAuth";
import { SingleQuestion } from "@/components/survey/SingleQuestion";

// Sử dụng type từ onboardingservices.ts
import type { SurveyQuestion } from "@/services/onboardingservices";

const Onboarding = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<SurveyQuestion[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<SurveyData & { [key: string]: any }>(
    {}
  );

  const navigate = useNavigate();
  const { success } = useToast();
  const { setUser } = useAuth();

  // Shuffle array utility (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Fetch survey questions when the component mounts
  useEffect(() => {
    fetchSurveyQuestions().then((data) => {
      // Shuffle swipe cards and limit to 10 cards
      const processedQuestions = data.map((q) => {
        if (q.type === "swipe-cards" && q.cards && q.cards.length > 0) {
          const shuffledCards = shuffleArray(q.cards);
          const limitedCards = shuffledCards.slice(0, 10); // Show only 10 random cards
          return { ...q, cards: limitedCards };
        }
        return q;
      });

      setQuestions(processedQuestions);

      // Initialize form data with empty values based on question types
      const initialFormData: Record<string, string | string[]> = {};
      processedQuestions.forEach((q) => {
        initialFormData[q.key] = q.type === "checkbox" ? [] : "";
      });
      setFormData(initialFormData);

      // Filter questions based on initial conditions
      updateVisibleQuestions(processedQuestions, initialFormData);
    });
  }, []);

  // Update visible questions whenever form data changes
  useEffect(() => {
    if (questions.length > 0) {
      updateVisibleQuestions(questions, formData);
    }
  }, [formData, questions]);

  // Filter questions based on conditions
  const updateVisibleQuestions = (
    allQuestions: SurveyQuestion[],
    data: Record<string, string | string[]>
  ) => {
    const filtered = allQuestions.filter((q) => {
      // Skip questions with unsatisfied conditions
      if (q.condition && q.condition.dependsOn && q.condition.showIfEquals) {
        const dependencyValue = data[q.condition.dependsOn];
        return dependencyValue === q.condition.showIfEquals;
      }
      return true; // Include questions without conditions
    });

    setVisibleQuestions(filtered);
  };

  // Handle value changes for all question types
  const handleQuestionChange = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await completeOnboarding(formData as SurveyData);

      // Update user state after successful submission
      const userData = await import("@/services/authservices").then((m) =>
        m.getCurrentUser()
      );
      setUser?.(userData);

      if (userData.hasCompletedSurvey !== undefined) {
        localStorage.setItem(
          "hasCompletedSurvey",
          String(userData.hasCompletedSurvey)
        );
      }

      success("Your preferences have been saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  // No need for extra currentQuestion variable since we access by index directly

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-white to-emerald-500 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="animate-fade-in bg-white shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Let's personalize your TimeWisely experience</CardTitle>
            <CardDescription>
              Help us understand your preferences so we can suggest the perfect
              activities for you.
            </CardDescription>
            {visibleQuestions.length > 0 && (
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {visibleQuestions.map((_, idx) => (
                    <div
                      key={`step-${idx}`}
                      className={`w-3 h-3 rounded-full ${
                        idx <= currentQuestionIndex
                          ? "bg-[var(--wisely-gold)]"
                          : "bg-gray-300 dark:bg-amber-900"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-4 px-8">
            {visibleQuestions.length > 0 &&
            currentQuestionIndex < visibleQuestions.length ? (
              <SingleQuestion
                question={visibleQuestions[currentQuestionIndex]}
                value={formData[visibleQuestions[currentQuestionIndex].key]}
                onChange={(value) => {
                  handleQuestionChange(
                    visibleQuestions[currentQuestionIndex].key,
                    value
                  );
                }}
                onAutoAdvance={
                  visibleQuestions[currentQuestionIndex].type === "radio" &&
                  currentQuestionIndex < visibleQuestions.length - 1
                    ? handleNext
                    : undefined
                }
              />
            ) : (
              <div className="text-center py-8">
                <p>Loading survey questions...</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between p-6">
            <Button
              variant="outline"
              onClick={() => handlePrevious()}
              disabled={currentQuestionIndex === 0}
              className="border-gray-300 text-[var(--wisely-gray)] hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[var(--wisely-gold)] hover:bg-yellow-600 text-white"
            >
              {currentQuestionIndex === visibleQuestions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
