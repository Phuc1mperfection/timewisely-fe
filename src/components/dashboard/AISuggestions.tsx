import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, MapPin, Plus } from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  duration: string;
  location?: string;
  category: string;
  color: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    title: "Morning Yoga Session",
    description: "Start your day with a relaxing 30-minute yoga routine",
    duration: "30 min",
    location: "Home",
    category: "Wellness",
    color: "#5eead4", // mint
  },
  {
    id: "2",
    title: "Read a Chapter",
    description:
      'Continue reading "The Art of Focus" based on your reading habits',
    duration: "25 min",
    category: "Learning",
    color: "#8b5cf6", // yellow
  },
  {
    id: "3",
    title: "Walk in the Park",
    description: "Take a refreshing walk to boost your energy",
    duration: "20 min",
    location: "Central Park",
    category: "Exercise",
    color: "#5eead4", // mint
  },
  {
    id: "4",
    title: "Call a Friend",
    description: "Catch up with Sarah, you haven't talked in a while",
    duration: "15 min",
    category: "Social",
    color: "#f9a8d4", // pastel pink
  },
  {
    id: "5",
    title: "Meal Prep",
    description: "Prepare healthy snacks for the week",
    duration: "45 min",
    location: "Kitchen",
    category: "Health",
    color: "#fde68a", // light yellow for highlight only
  },
];

export function AISuggestions() {
  const handleAddSuggestion = (suggestion: Suggestion) => {
    console.log("Adding suggestion to calendar:", suggestion);
    // This would integrate with the calendar to add the suggested activity
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>AI Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Smart activity recommendations based on your free time and
          preferences.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mockSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 bg-muted/50 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">
                  {suggestion.title}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="h-6 w-6 p-0 hover:bg-background hover:text-primary"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {suggestion.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{suggestion.duration}</span>
                  </div>
                  {suggestion.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{suggestion.location}</span>
                    </div>
                  )}
                </div>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: suggestion.color }}
                >
                  {suggestion.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button variant="default" className="w-full mt-4">
          <Sparkles className="h-4 w-4" />
          Get More Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
