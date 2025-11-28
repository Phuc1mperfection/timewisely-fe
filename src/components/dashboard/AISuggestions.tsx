import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    color: "#5eead4",
  },
  {
    id: "2",
    title: "Read a Chapter",
    description:
      'Continue reading "The Art of Focus" based on your reading habits',
    duration: "25 min",
    category: "Learning",
    color: "#8b5cf6",
  },
  {
    id: "3",
    title: "Walk in the Park",
    description: "Take a refreshing walk to boost your energy",
    duration: "20 min",
    location: "Central Park",
    category: "Exercise",
    color: "#5eead4",
  },
  {
    id: "4",
    title: "Call a Friend",
    description: "Catch up with Sarah, you haven't talked in a while",
    duration: "15 min",
    category: "Social",
    color: "#f9a8d4",
  },
  {
    id: "5",
    title: "Meal Prep",
    description: "Prepare healthy snacks for the week",
    duration: "45 min",
    location: "Kitchen",
    category: "Health",
    color: "#fde68a",
  },
];

export function AISuggestions() {
  const handleAddSuggestion = (suggestion: Suggestion) => {
    console.log("Adding suggestion to calendar:", suggestion);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
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
              className="p-3 rounded-lg border bg-card transition-colors hover:bg-accent/50"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">
                  {suggestion.title}
                </h4>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="h-6 w-6 shrink-0"
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
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${suggestion.color}20`,
                    color: suggestion.color,
                    borderColor: suggestion.color,
                  }}
                >
                  {suggestion.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full" variant="outline">
          <Sparkles className="h-4 w-4" />
          Get More Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
