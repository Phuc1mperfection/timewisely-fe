import { useEffect, useState } from "react";
import {
  fetchMySurvey,
  type SurveyResponse,
} from "@/services/onboardingservices";

export function useSurvey() {
  const [survey, setSurvey] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchMySurvey()
      .then((data) => {
        setSurvey(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch survey data: " + err.message);
        setSurvey(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { survey, loading, error };
}
