/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { QuoteOverlayCard } from "../ui/quote-card";
import { Button } from "../ui/button";
import { Coffee, HandHeart, Sparkles, Target, TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card, CardContent } from "../ui/card";

interface MotivationalQuote {
  text: string;
  author: string;
  category: string;
  backgroundImage: string;
  gifUrl?: string;
}

export const DailyMotivationHub1 = () => {
  const { isDark } = useTheme();
  const { iconColors } = useThemeColors();
  const motivationalQuotes: MotivationalQuote[] = [
    {
      text: "Don't wait for inspiration. Start coding and it will follow.",
      author: "Phúc Nguyễn",
      category: "action",
      backgroundImage:
        "https://images.unsplash.com/photo-1682686580849-3e7f67df4015?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gifUrl: "https://media0.giphy.com/media/98fRKRZvMsNtSeMyxH/giphy.gif",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "action",
      backgroundImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media2.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
    },
    {
      text: "Action is the foundational key to all success.",
      author: "Pablo Picasso",
      category: "action",
      backgroundImage:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media3.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    },
    {
      text: "Time is money.",
      author: "Benjamin Franklin",
      category: "time",
      backgroundImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media1.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
    },
    {
      text: "Time is what we want most, but what we use worst.",
      author: "William Penn",
      category: "time",
      backgroundImage:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media0.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif",
    },
    {
      text: "You don't have to be great to get started, but you have to get started to be great.",
      author: "Les Brown",
      category: "motivation",
      backgroundImage:
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media2.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    },
    {
      text: "Focus on being productive instead of busy.",
      author: "Tim Ferriss",
      category: "productivity",
      backgroundImage:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXdsZHo3YnR4ZW4zbW03MmRqMXVrcW1nb2t6MGZkZXZsMGVocTNtdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ZB5VJ2pH5ftEqA21pp/giphy.gif",
    },
    {
      text: "Small progress is still progress.",
      author: "Phúc Nguyễn",
      category: "productivity",
      backgroundImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media2.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif",
    },
    {
      text: "Success usually comes to those who are too busy to be looking for it.",
      author: "Henry David Thoreau",
      category: "success",
      backgroundImage:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media1.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
      category: "future",
      backgroundImage:
        "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gifUrl: "https://media2.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
    },
    {
      text: "Time isn’t the main thing. It’s the only thing",
      author: "Miles Davis",
      category: "time",
      backgroundImage:
        "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      gifUrl:
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGFyMW1scnN0anJuaDFweXc0b3hzeWhjN2xwcW5rZDBjejdwamp5cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WUUt2ujWlssvUenOuf/giphy.gif",
    },
    {
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
      category: "future",
      backgroundImage:
        "https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
      gifUrl: "https://media0.giphy.com/media/98fRKRZvMsNtSeMyxH/giphy.gif",
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
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(
    null
  );
  const [quoteCategory, setQuoteCategory] = useState<string>("random");
  const [currentNudge, setCurrentNudge] = useState<string>("");

  const getRandomQuote = (category: string): MotivationalQuote | null => {
    let filteredQuotes = motivationalQuotes;

    if (category !== "random") {
      filteredQuotes = motivationalQuotes.filter(
        (quote) => quote.category === category
      );
    }

    if (filteredQuotes.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  };

  const getRandomNudge = () => {
    const randomIndex = Math.floor(Math.random() * positiveNudges.length);
    setCurrentNudge(positiveNudges[randomIndex]);
  };

  // Update quote and nudge when category changes or on component mount
  useEffect(() => {
    const quote = getRandomQuote(quoteCategory);
    setCurrentQuote(quote);

    // Get a random nudge when component mounts or category changes
    const randomNudge =
      positiveNudges[Math.floor(Math.random() * positiveNudges.length)];
    setCurrentNudge(randomNudge);
  }, [quoteCategory]);
  return (
    <Card className="space-y-4 px-4">
      <CardContent className="space-y-4 px-0">
        {currentQuote && (
          <QuoteOverlayCard
            backgroundImage={currentQuote.backgroundImage}
            quote={currentQuote.text}
            author={currentQuote.author}
            gifUrl={currentQuote.gifUrl}
          />
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
                      ? "var(--wisely-champagne)"
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
                      ? "var(--wisely-champagne)"
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
                      ? "var(--wisely-champagne)"
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
                      ? "var(--wisely-champagne)"
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
                      ? "var(--wisely-champagne)"
                      : "white"
                    : iconColors.secondary,
              }}
            />
            <span>Motivation</span>
          </Button>
        </div>
        {currentNudge && (
          <div className="mt-4 border-t pt-3 border-border/50 relative">
            <p className="text-sm text-muted-foreground/90 italic pr-8 transition-all duration-300 ease-in-out">
              <span
                className={`font-semibold ${
                  isDark
                    ? "text-[var(--wisely-champagne)]"
                    : "text-[var(--wisely-gold)]"
                }`}
              >
                Today's Reminder:
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
                    : "text-[var(--wisely-gold)]"
                }`}
              />
              <span className="sr-only">Refresh nudge</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
