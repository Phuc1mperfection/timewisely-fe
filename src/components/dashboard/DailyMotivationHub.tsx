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
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColors } from "@/hooks/useThemeColors";

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
    author:" Benjamin Franklin",
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
    text: "Time isn’t the main thing. It’s the only thing",
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

export function DailyMotivationHub() {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(
    null
  );
  const [currentNudge, setCurrentNudge] = useState<string>("");
  const [quoteCategory, setQuoteCategory] = useState<string>("random");
  const { isDark } = useTheme();
  const { iconColors } = useThemeColors();

  useEffect(() => {
    getRandomQuote(quoteCategory);
    getRandomNudge();
  }, [quoteCategory]);

  const getRandomQuote = (category: string) => {
    let filteredQuotes = motivationalQuotes;

    if (category !== "random") {
      filteredQuotes = motivationalQuotes.filter(
        (quote) => quote.category === category
      );
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  const getRandomNudge = () => {
    const randomIndex = Math.floor(Math.random() * positiveNudges.length);
    setCurrentNudge(positiveNudges[randomIndex]);
  };
  return (
    <Card className=" flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles
            className={`h-5 w-5 ${
              isDark
                ? "text-[var(--wisely-yellow)]"
                : "text-[var(--wisely-purple)]"
            }`}
          />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {" "}
        {currentQuote && (
          <div className="space-y-4">
            <div className="relative">
              <Quote
                className={`absolute -left-1 -top-1 h-5 w-5 ${
                  isDark
                    ? "text-[var(--wisely-mint)]"
                    : "text-[var(--wisely-purple)]"
                } opacity-40`}
              />
              <p className="pl-6 pt-2 text-base italic">{currentQuote.text}</p>
              <p className="text-sm text-muted-foreground text-right mt-2">
                — {currentQuote.author}
              </p>
            </div>
            {currentNudge && (
              <div className="mt-4 border-t pt-3 border-border/50 relative">
                <p className="text-sm text-muted-foreground/90 italic pr-8 transition-all duration-300 ease-in-out">
                  <span
                    className={`font-semibold ${
                      isDark
                        ? "text-[var(--wisely-mint)]"
                        : "text-[var(--wisely-purple)]"
                    }`}
                  >
                    Today's Nudge:
                  </span>{" "}
                  <span key={currentNudge} className="animate-fadeIn">
                    {currentNudge}
                  </span>
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-3 h-7 w-7 p-1 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    getRandomNudge();
                  }}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isDark
                        ? "text-[var(--wisely-yellow)]"
                        : "text-[var(--wisely-purple)]"
                    }`}
                  />
                  <span className="sr-only">Refresh nudge</span>
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            size="sm"
            variant={quoteCategory === "random" ? "default" : "outline"}
            onClick={() => setQuoteCategory("random")}
            className={isDark ? "dark:hover:bg-muted/50" : "hover:bg-muted/50"}
          >
            <Sparkles
              className="h-3.5 w-3.5"
              style={{
                color:
                  quoteCategory === "random"
                    ? isDark
                      ? "var(--wisely-mint)"
                      : "white"
                    : iconColors.primary,
              }}
            />
            <span>Random</span>
          </Button>

          <Button
            size="sm"
            variant={quoteCategory === "action" ? "default" : "outline"}
            onClick={() => setQuoteCategory("action")}
            className={isDark ? "dark:hover:bg-muted/50" : "hover:bg-muted/50"}
          >
            <Coffee
              className="h-3.5 w-3.5"
              style={{
                color:
                  quoteCategory === "action"
                    ? isDark
                      ? "var(--wisely-mint)"
                      : "white"
                    : iconColors.primary,
              }}
            />
            <span>Action</span>
          </Button>

          <Button
            size="sm"
            variant={quoteCategory === "time" ? "default" : "outline"}
            onClick={() => setQuoteCategory("time")}
            className={isDark ? "dark:hover:bg-muted/50" : "hover:bg-muted/50"}
          >
            <Target
              className="h-3.5 w-3.5"
              style={{
                color:
                  quoteCategory === "time"
                    ? isDark
                      ? "var(--wisely-mint)"
                      : "white"
                    : iconColors.secondary,
              }}
            />
            <span>Time</span>
          </Button>

          <Button
            size="sm"
            variant={quoteCategory === "productivity" ? "default" : "outline"}
            onClick={() => setQuoteCategory("productivity")}
            className={isDark ? "dark:hover:bg-muted/50" : "hover:bg-muted/50"}
          >
            <TrendingUp
              className="h-3.5 w-3.5"
              style={{
                color:
                  quoteCategory === "productivity"
                    ? isDark
                      ? "var(--wisely-mint)"
                      : "white"
                    : iconColors.primary,
              }}
            />
            <span>Productivity</span>
          </Button>

          <Button
            size="sm"
            variant={quoteCategory === "motivation" ? "default" : "outline"}
            onClick={() => setQuoteCategory("motivation")}
            className={isDark ? "dark:hover:bg-muted/50" : "hover:bg-muted/50"}
          >
            <HandHeart
              className="h-3.5 w-3.5"
              style={{
                color:
                  quoteCategory === "motivation"
                    ? isDark
                      ? "var(--wisely-mint)"
                      : "white"
                    : iconColors.secondary,
              }}
            />
            <span>Motivation</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
