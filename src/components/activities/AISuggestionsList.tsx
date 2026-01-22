import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Clock, RefreshCw } from "lucide-react";
import {
  getSavedAISuggestions,
  generateAISuggestions,
  type SavedAISuggestion,
} from "@/services/suggestionServices";
import { fetchMySurvey } from "@/services/onboardingServices";
import { useToast } from "@/hooks/useToast";


export const AISuggestionsList = () => {
  const [suggestions, setSuggestions] = useState<SavedAISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [hasSuggestions, setHasSuggestions] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const data = await getSavedAISuggestions();
      setSuggestions(data.suggestions);
      setHasSuggestions(data.hasSuggestions);
    } catch (e) {
        console.error("Failed to load AI suggestions:", e);
        error("Failed to load AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      
      // Fetch user's survey data
      const surveyResponse = await fetchMySurvey();
      
      // Generate new suggestions
      const result = await generateAISuggestions({ answers: surveyResponse.answers });
      
      setSuggestions(result.suggestions);
      setHasSuggestions(true);
      success("New AI suggestions generated!");
    } catch (e) {
      console.error("Failed to regenerate suggestions:", e);
      error("Failed to regenerate suggestions. Please try again.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </CardContent>
      </Card>
    );
  }

  if (!hasSuggestions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            AI Activity Suggestions
          </CardTitle>
          <CardDescription>
            No suggestions available yet. Complete the onboarding survey to get personalized recommendations.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-600" />
          AI-Powered Recommendations ({suggestions.length})
        </h3>
        <Button
          onClick={handleRegenerate}
          disabled={regenerating}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {regenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{suggestion.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                {new Date(suggestion.startDate).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })} • {Math.round(
                  (new Date(suggestion.endDate).getTime() -
                    new Date(suggestion.startDate).getTime()) /
                    60000
                )} min
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                {suggestion.category}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {suggestion.rationale}
              </p>
              {/* TODO: Add "Add to Calendar" button */}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        💡 These suggestions are saved and won't consume AI quota when you revisit this page.
      </p>
    </div>
  );
};
