import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  Clock,
  MapPin,
  Plus,
  Lightbulb,
  Brain,
  Target,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  getRuleBasedSuggestions,
  getAISuggestions,
  acceptSuggestion,
  type Suggestion,
} from "@/services/suggestionServices";
import { useToast } from "@/hooks/useToast";

export function AISuggestions() {
  const [ruleBasedSuggestions, setRuleBasedSuggestions] = useState<
    Suggestion[]
  >([]);
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>([]);
  const [loadingRuleBased, setLoadingRuleBased] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<"rule-based" | "ai">("rule-based");

  // Track which suggestions have been added to calendar
  const [addedRuleBasedIds, setAddedRuleBasedIds] = useState<Set<string>>(
    new Set()
  );
  const [addedAIIds, setAddedAIIds] = useState<Set<string>>(new Set());

  const { success, error } = useToast();

  const fetchRuleBasedSuggestions = async () => {
    try {
      setLoadingRuleBased(true);
      const data = await getRuleBasedSuggestions(5);
      setRuleBasedSuggestions(data);
      setAddedRuleBasedIds(new Set()); // Reset added IDs when fetching new suggestions
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 400) {
        setRuleBasedSuggestions([]);
      } else {
        error("Failed to load suggestions");
      }
      console.error(err);
    } finally {
      setLoadingRuleBased(false);
    }
  };

  const fetchAISuggestions = async () => {
    try {
      setLoadingAI(true);
      const data = await getAISuggestions(5);
      setAiSuggestions(data);
      setAddedAIIds(new Set()); // Reset added IDs when fetching new suggestions
      success("AI suggestions generated!");
    } catch (err: any) {
      if (err?.response?.status === 503 || err?.response?.status === 429) {
        error("AI quota exceeded. Please try again later.");
      } else if (
        err?.response?.status === 404 ||
        err?.response?.status === 400
      ) {
        setAiSuggestions([]);
        error("Please complete onboarding survey first");
      } else {
        error("AI service unavailable. Please try again later.");
      }
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    // Auto-load rule-based suggestions on mount
    fetchRuleBasedSuggestions();
  }, []);

  const handleAddSuggestion = async (suggestion: Suggestion) => {
    try {
      await acceptSuggestion(suggestion.id, suggestion);
      success(`"${suggestion.title}" added to your calendar!`);

      // Notify calendar to refresh
      window.dispatchEvent(new CustomEvent("activityAdded"));

      // Mark this suggestion as added (disable it)
      if (activeTab === "rule-based") {
        const newAddedIds = new Set(addedRuleBasedIds);
        newAddedIds.add(suggestion.id);
        setAddedRuleBasedIds(newAddedIds);

        // Auto-refresh if all suggestions have been added
        if (newAddedIds.size === ruleBasedSuggestions.length) {
          success("All suggestions added! Loading new ones...");
          setTimeout(() => fetchRuleBasedSuggestions(), 1000);
        }
      } else {
        const newAddedIds = new Set(addedAIIds);
        newAddedIds.add(suggestion.id);
        setAddedAIIds(newAddedIds);

        // Auto-refresh if all suggestions have been added
        if (newAddedIds.size === aiSuggestions.length) {
          success("All suggestions added! Loading new ones...");
          setTimeout(() => fetchAISuggestions(), 1000);
        }
      }
    } catch (err) {
      error("Failed to add activity to calendar");
      console.error(err);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatTimeRange = (suggestedTime: string, duration: number) => {
    try {
      const startTime = new Date(suggestedTime);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      };

      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    } catch (err) {
      return formatDuration(duration);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--wisely-gold)]" />
          <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Smart Activity Suggestions
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized recommendations based on your goals and preferences
        </p>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="rule-based"
          onValueChange={(value) => setActiveTab(value as "rule-based" | "ai")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="rule-based" className="flex-1">
              <Target className="w-4 h-4 mr-2" />
              Smart Picks
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              <Brain className="w-4 h-4 mr-2" />
              AI Powered
            </TabsTrigger>
          </TabsList>

          {/* Rule-Based Tab */}
          <TabsContent value="rule-based">
            {loadingRuleBased ? (
              <div className="text-center py-8">
                <Target className="w-8 h-8 mx-auto mb-2 animate-pulse text-[var(--wisely-gold)]" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your preferences...
                </p>
              </div>
            ) : ruleBasedSuggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">
                  Complete onboarding to get smart suggestions!
                </p>
              </div>
            ) : (
              <>
                {/* Progress indicator */}
                {addedRuleBasedIds.size > 0 && (
                  <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {addedRuleBasedIds.size} of{" "}
                      {ruleBasedSuggestions.length} added to calendar
                    </p>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ruleBasedSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onAdd={handleAddSuggestion}
                      formatTimeRange={formatTimeRange}
                      formatDuration={formatDuration}
                      isAdded={addedRuleBasedIds.has(suggestion.id)}
                    />
                  ))}
                </div>
                <Button
                  onClick={fetchRuleBasedSuggestions}
                  disabled={loadingRuleBased}
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                >
                  <Target className="w-4 h-4 mr-2" />
                  {loadingRuleBased ? "Loading..." : "Refresh Smart Picks"}
                </Button>
              </>
            )}
          </TabsContent>

          {/* AI-Powered Tab */}
          <TabsContent value="ai">
            {!loadingAI && aiSuggestions.length === 0 && (
              <div className="text-center py-4 mb-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  Click "Generate AI Suggestions" to use Gemini AI (uses quota)
                </p>
              </div>
            )}

            {loadingAI ? (
              <div className="text-center py-8">
                <Brain className="w-8 h-8 mx-auto mb-2 animate-pulse text-purple-600" />
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your patterns...
                </p>
              </div>
            ) : aiSuggestions.length > 0 ? (
              <>
                {/* Progress indicator */}
                {addedAIIds.size > 0 && (
                  <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {addedAIIds.size} of {aiSuggestions.length} added to
                      calendar
                    </p>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {aiSuggestions.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onAdd={handleAddSuggestion}
                      formatTimeRange={formatTimeRange}
                      formatDuration={formatDuration}
                      isAI={true}
                      isAdded={addedAIIds.has(suggestion.id)}
                    />
                  ))}
                </div>
                <Button
                  onClick={fetchAISuggestions}
                  disabled={loadingAI}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {loadingAI ? "Loading..." : "Refresh AI Suggestions"}
                </Button>
              </>
            ) : (
              <Button
                onClick={fetchAISuggestions}
                disabled={loadingAI}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Suggestions
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Separate component for suggestion card
function SuggestionCard({
  suggestion,
  onAdd,
  formatTimeRange,
  formatDuration,
  isAI = false,
  isAdded = false,
}: {
  suggestion: Suggestion;
  onAdd: (s: Suggestion) => void;
  formatTimeRange: (time: string, duration: number) => string;
  formatDuration: (minutes: number) => string;
  isAI?: boolean;
  isAdded?: boolean;
}) {
  return (
    <Card
      className={`hover:shadow-lg transition-all ${
        isAdded ? "opacity-50 bg-gray-50" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4
                className={`font-semibold ${
                  isAdded ? "line-through text-gray-500" : ""
                }`}
              >
                {suggestion.title}
              </h4>
              {isAdded && (
                <span className="text-green-600 text-xs font-bold">
                  ✓ Added
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: suggestion.color }}
              >
                {suggestion.category}
              </span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-full font-semibold">
                {Math.round(suggestion.score * 100)}% match
              </span>
              {isAI && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium">
                  AI
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onAdd(suggestion)}
            disabled={isAdded}
            className={`h-8 w-8 p-0 ${
              isAdded
                ? "bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500"
            }`}
          >
            {isAdded ? (
              <span className="text-white font-bold">✓</span>
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p
          className={`text-sm mb-3 ${
            isAdded ? "text-gray-400" : "text-muted-foreground"
          }`}
        >
          {suggestion.description}
        </p>

        {/* AI Reasoning */}
        <div
          className={`flex items-start gap-2 mb-3 p-2 rounded-lg border ${
            isAdded
              ? "bg-gray-100 border-gray-300"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <Lightbulb
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              isAdded ? "text-gray-400" : "text-amber-600"
            }`}
          />
          <p
            className={`text-xs italic ${
              isAdded ? "text-gray-500" : "text-amber-900"
            }`}
          >
            {suggestion.reasoning}
          </p>
        </div>

        <div
          className={`flex items-center gap-3 text-xs ${
            isAdded ? "text-gray-400" : "text-muted-foreground"
          }`}
        >
          <div className="flex items-center gap-1 font-medium">
            <Clock
              className={`w-3.5 h-3.5 ${
                isAdded ? "text-gray-400" : "text-[var(--wisely-gold)]"
              }`}
            />
            <span>
              {formatTimeRange(suggestion.suggestedTime, suggestion.duration)}
            </span>
          </div>
          <span
            className={`font-medium ${
              isAdded ? "text-gray-400" : "text-amber-600"
            }`}
          >
            ({formatDuration(suggestion.duration)})
          </span>
          {suggestion.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{suggestion.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
