import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Quote, Target, TrendingUp, Coffee, HandHeart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MotivationalQuote {
  text: string;
  author: string;
  category: string;
}

const motivationalQuotes: MotivationalQuote[] = [
  {
    text: "Don't wait for inspiration. Start coding and it will follow.",
    author: "Phúc Nguyễn",
    category: "action"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action"
  },
  {
    text: "Time is what we want most, but what we use worst.",
    author: "William Penn",
    category: "time"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown",
    category: "motivation"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "productivity"
  },
  {
    text: "Small progress is still progress.",
    author: "Phúc Nguyễn",
    category: "growth"
  },
  {
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "success"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
    category: "future"
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
];

export function DailyMotivationHub() {
  const [todayQuote, setTodayQuote] = useState<MotivationalQuote>(motivationalQuotes[0]);
  const [todayNudge, setTodayNudge] = useState<string>(positiveNudges[0]);

  useEffect(() => {
    // Get today's date as seed for consistent daily quote
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    const nudgeIndex = today % positiveNudges.length;
    
    setTodayQuote(motivationalQuotes[quoteIndex]);
    setTodayNudge(positiveNudges[nudgeIndex]);
  }, []);

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setTodayQuote(motivationalQuotes[randomIndex]);
    
    const randomNudgeIndex = Math.floor(Math.random() * positiveNudges.length);
    setTodayNudge(positiveNudges[randomNudgeIndex]);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-emerald-50 border-purple-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-wisely-purple">
          <HandHeart className="w-5 h-5" />
          <span>Daily Motivation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quote of the Day */}
        <div className="relative p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-purple-100 shadow-sm">
          <Quote className="absolute top-4 left-4 w-6 h-6 text-purple-300" />
          <div className="ml-8">
            <p className="text-lg font-medium text-wisely-dark leading-relaxed mb-3">
              "{todayQuote.text}"
            </p>
            <p className="text-sm text-wisely-gray font-medium">
              — {todayQuote.author}
            </p>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-100">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-wisely-mint" />
            <h4 className="font-semibold text-wisely-dark">Today's Focus</h4>
          </div>
          <p className="text-sm text-wisely-gray">{todayNudge}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-purple-500 text-center">
            <TrendingUp className="w-5 h-5 text-wisely-purple mx-auto mb-1" />
            <div className="text-lg font-bold text-wisely-dark">7</div>
            <div className="text-xs text-wisely-gray">Day Streak</div>
          </div>
          <div className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-emerald-500 text-center">
            <Coffee className="w-5 h-5 text-wisely-mint mx-auto mb-1" />
            <div className="text-lg font-bold text-wisely-dark">3</div>
            <div className="text-xs text-wisely-gray">Focus Sessions</div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={getNewQuote}
          variant="default" 
          className="w-full border-purple-200 hover:bg-purple-500 hover:border-purple-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Get New Inspiration
        </Button>
      </CardContent>
    </Card>
  );
}