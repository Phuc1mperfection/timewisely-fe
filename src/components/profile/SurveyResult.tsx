import { useRef } from "react";
import { useSurvey } from "@/hooks/useSurvey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import { User, Target, Zap, Clock, Music, Heart } from "lucide-react";

interface SurveyAnswers {
  workSchedule?: string;
  primaryGoal?: string;
  biggestChallenge?: string;
  favoriteCategory?: string[];
  freeTime?: string[];
  hobbies?: string[];
  environment?: string;
  activityPreferences?: string[];
}

const SurveyResults = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { survey, loading, error } = useSurvey();
  const surveyData: SurveyAnswers = survey?.answers?.answers || {};

  // Activity preferences mapping from survey-questions.json
  const activityCards = [
    {
      id: "morning-yoga",
      title: "Morning Yoga",
      emoji: "🧘",
      category: "Fitness",
    },
    {
      id: "reading-session",
      title: "Reading Time",
      emoji: "📚",
      category: "Learning",
    },
    {
      id: "mindful-walk",
      title: "Mindful Walk",
      emoji: "🚶",
      category: "Wellness",
    },
    {
      id: "workout",
      title: "Fitness Workout",
      emoji: "💪",
      category: "Fitness",
    },
    {
      id: "meditation",
      title: "Meditation",
      emoji: "🧘‍♀️",
      category: "Wellness",
    },
    {
      id: "creative-time",
      title: "Creative Project",
      emoji: "🎨",
      category: "Creative",
    },
    {
      id: "social-time",
      title: "Social Connection",
      emoji: "👥",
      category: "Social",
    },
    {
      id: "learning",
      title: "Skill Learning",
      emoji: "💻",
      category: "Learning",
    },
    {
      id: "deep-work",
      title: "Deep Work Session",
      emoji: "💼",
      category: "Work/Productivity",
    },
    {
      id: "cooking",
      title: "Healthy Cooking",
      emoji: "🍳",
      category: "Cooking/Nutrition",
    },
    {
      id: "outdoor-run",
      title: "Outdoor Running",
      emoji: "🏃",
      category: "Fitness",
    },
    {
      id: "music-practice",
      title: "Music Practice",
      emoji: "🎵",
      category: "Creative",
    },
    {
      id: "gaming-session",
      title: "Gaming Time",
      emoji: "🎮",
      category: "Creative",
    },
    {
      id: "journaling",
      title: "Journaling",
      emoji: "📝",
      category: "Wellness",
    },
    {
      id: "stretching",
      title: "Stretching Routine",
      emoji: "🤸",
      category: "Fitness",
    },
    {
      id: "podcast-learning",
      title: "Podcast Learning",
      emoji: "🎧",
      category: "Learning",
    },
    {
      id: "planning-session",
      title: "Weekly Planning",
      emoji: "📅",
      category: "Work/Productivity",
    },
    {
      id: "nature-walk",
      title: "Nature Walk",
      emoji: "🌳",
      category: "Wellness",
    },
    {
      id: "language-practice",
      title: "Language Learning",
      emoji: "🌍",
      category: "Learning",
    },
    { id: "cycling", title: "Cycling", emoji: "🚴", category: "Fitness" },
    {
      id: "family-time",
      title: "Family Bonding",
      emoji: "👨‍👩‍👧‍👦",
      category: "Social",
    },
    {
      id: "meal-prep",
      title: "Meal Prep",
      emoji: "🥗",
      category: "Cooking/Nutrition",
    },
    {
      id: "photography",
      title: "Photography",
      emoji: "📸",
      category: "Creative",
    },
    {
      id: "breathing-exercise",
      title: "Breathing Exercise",
      emoji: "🌬️",
      category: "Wellness",
    },
  ];

  const getActivityTitles = (ids: string[]) => {
    return ids.map((id) => {
      const card = activityCards.find((c) => c.id === id);
      return card ? card.title : id;
    });
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Work/Productivity": "bg-orange-100 text-orange-800 border-orange-200",
      Fitness: "bg-green-100 text-green-800 border-green-200",
      "Learning/Education": "bg-yellow-100 yellow-800 border-yellow-200",
      "Mindfulness/Wellness": "bg-amber-50 text-pink-800 border-amber-100",
      "Social/Family": "bg-orange-100 text-orange-800 border-orange-200",
      "Cooking/Nutrition": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Creative: "bg-orange-200 text-orange-900 border-yellow-200",
      Learning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Wellness: "bg-amber-50 text-pink-800 border-amber-100",
      Social: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colorMap[category] || "bg-gray-100 border-gray-200";
  };

  if (loading) {
    return <div className="p-8 text-center text-lg text-gray-500">Loading</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  }
  if (!survey) {
    return (
      <div className="p-8 text-center text-lg text-gray-500">
        No survey data available.
      </div>
    );
  }

return (
  <div className="space-y-8">
    {/* Print Button */}
    <div className="flex justify-end print:hidden">
      <PrintButton
        contentRef={printRef}
        documentTitle="Survey Results"
        buttonText="Print Survey Results"
        variant="outline"
      />
    </div>

    {/* Printable Content */}
    <div ref={printRef}>
      {/* Favorite Categories */}
      <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <div className="w-8 h-8 bg-linear-to-r from-yellow-400 to-amber-300 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Favorite Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(surveyData.favoriteCategory as string[] | undefined)?.map(
              (category, index) => (
                <Badge
                  key={category}
                  className={`${getCategoryColor(
                    category
                  )} px-4 py-2 rounded-full font-medium hover:scale-105 transition-all duration-200 animate-fade-in border text-black`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </Badge>
              )
            ) || <span className="text-gray-500">Not answered</span>}
          </div>
        </CardContent>
      </Card>

      {/* Free Time */}
      <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-white" />
            </div>
            Free Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(surveyData.freeTime as string[] | undefined)?.map((time) => (
              <Badge
                key={time}
                className="bg-yellow-50 text-orange-800 border border-yellow-200"
              >
                {time}
              </Badge>
            )) || <span className="text-gray-500">Not answered</span>}
          </div>
        </CardContent>
      </Card>

      {/* Hobbies */}
      <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <div className="w-8 h-8 bg-linear-to-r from-amber-300 to-rose-400 rounded-lg flex items-center justify-center mr-3">
              <Music className="w-4 h-4 text-white" />
            </div>
            Hobbies & Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(surveyData.hobbies as string[] | undefined)?.map((hobby) => (
              <Badge
                key={hobby}
                className="bg-pink-50 text-pink-700 border border-amber-100"
              >
                {hobby}
              </Badge>
            )) || <span className="text-gray-500">Not answered</span>}
          </div>
        </CardContent>
      </Card>

      {/* Activity Preferences */}
      <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold">
            <div className="w-8 h-8 bg-linear-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-4 h-4 text-white" />
            </div>
            Activity Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {surveyData.activityPreferences ? (
              getActivityTitles(surveyData.activityPreferences).map((title) => (
                <Badge
                  key={title}
                  className="bg-teal-50 text-teal-700 border border-teal-200"
                >
                  {title}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">Not answered</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <div className="w-8 h-8 bg-linear-to-r from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Work Schedule</span>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                {surveyData.workSchedule ?? "Not answered"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Environment</span>
              <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200">
                {surveyData.environment ?? "Not answered"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 border-0 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <div className="w-8 h-8 bg-linear-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              Goals & Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Primary Goal
              </span>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                {surveyData.primaryGoal ?? "Not answered"}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Biggest Challenge
              </span>
              <Badge className="bg-red-50 text-red-700 border border-red-200">
                {surveyData.biggestChallenge ?? "Not answered"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
};

export default SurveyResults;