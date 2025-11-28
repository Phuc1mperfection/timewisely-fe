import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Quote,
  Target,
  TrendingUp,
  Coffee,
  HandHeart,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface MotivationalQuote {
  text: string;
  author: string;
  category: string;
}

const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "Don't wait for inspiration. Start coding and it will follow.",
    author: "Phúc Nguyễn",
    category: "action",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action",
  },
  {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "action",
  },
  {
    text: "Time is money.",
    author: "Benjamin Franklin",
    category: "time",
  },
  {
    text: "Time is what we want most, but what we use worst.",
    author: "William Penn",
    category: "time",
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown",
    category: "motivation",
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "productivity",
  },
  {
    text: "Small progress is still progress.",
    author: "Phúc Nguyễn",
    category: "productivity",
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "success",
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "future",
  },
  {
    text: "Time isn't the main thing. It's the only thing",
    author: "Miles Davis",
    category: "time",
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "future",
  },
];

const positiveNudges = [
  "You've got this! Take one small step today.",
  "Remember: progress over perfection.",
  "Your future self will thank you for starting now.",
  "Every expert was once a beginner.",
  "Success is the sum of small efforts repeated daily.",
  "Focus on what you can control today.",
  "Celebrate small wins to build momentum.",
  "Consistency is key. Keep going!",
  "You are capable of amazing things.",
  "Take a deep breath and tackle your next task.",
  "Believe in yourself and your abilities.",
  "Every day is a new opportunity to improve.",
];

const categoryButtons = [
  { id: "random", label: "Random", icon: Sparkles },
  { id: "action", label: "Action", icon: Coffee },
  { id: "time", label: "Time", icon: Target },
  { id: "productivity", label: "Productivity", icon: TrendingUp },
  { id: "motivation", label: "Motivation", icon: HandHeart },
];

export function DailyMotivationHub() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [currentNudge, setCurrentNudge] = useState<string>("");
  const [quoteCategory, setQuoteCategory] = useState<string>("random");

  const getRandomQuote = useCallback((category: string) => {
    let filteredQuotes = motivationalQuotes;

    if (category !== "random") {
      filteredQuotes = motivationalQuotes.filter(
        (quote) => quote.category === category
      );
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuote(filteredQuotes[randomIndex]);
  }, []);

  const getRandomNudge = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * positiveNudges.length);
    setCurrentNudge(positiveNudges[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomQuote(quoteCategory);
    getRandomNudge();
  }, [quoteCategory, getRandomQuote, getRandomNudge]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQuote && (
          <div className="space-y-3">
            <div className="relative pl-6">
              <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/40" />
              <p className="text-base italic leading-relaxed">
                {currentQuote.text}
              </p>
              <p className="text-sm text-muted-foreground text-right mt-2">
                — {currentQuote.author}
              </p>
            </div>
            
            {currentNudge && (
              <div className="border-t pt-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-muted-foreground italic flex-1">
                    <span className="font-semibold text-primary">
                      Today's Nudge:
                    </span>{" "}
                    {currentNudge}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={getRandomNudge}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="sr-only">Refresh nudge</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {categoryButtons.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              size="sm"
              variant={quoteCategory === id ? "default" : "outline"}
              onClick={() => setQuoteCategory(id)}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
