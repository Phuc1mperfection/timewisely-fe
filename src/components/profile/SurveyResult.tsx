import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/ui/print-button";
import PrintableSurveyResults from "@/components/print/PrintableSurveyResults";
import {
  User,
  Briefcase,
  Clock,
  Target,
  Zap,
  Gamepad,
  Music,
  Book,
  Home,
  Users,
  Sun,
  Moon,
} from "lucide-react";

const SurveyResults = () => {
  const printRef = useRef<HTMLDivElement>(null!);
  const surveyData = {
    age: "18-24",
    gender: "Male",
    favoriteCategories: [
      "Work/Productivity",
      "Fitness",
      "Learning/Education",
      "Mindfulness/Wellness",
      "Social/Family",
      "Cooking/Nutrition",
      "Creative",
    ],
    activityLevel: "Moderately Active",
    workStudyStyle: "Multitasker",
    workSchedule: "Standard 9am-5pm",
    freeTime: ["Evenings after work/study", "Weekends"],
    sleepSchedule: "Average (11pm-7am)",
    mainGoals: "Better Sleep Quality",
    mostImportantGoal: "Productivity & Efficiency",
    challenges: "Poor focus",
    hobbies: ["Gaming", "Music"],
    currentHabits: "Reading",
    priorityArea: "Education/Skills",
    preferredEnvironment: ["At home", "Gym/Fitness center"],
    socialPreference: "With a partner/friend",
    morningRoutine: "Yes, very consistent",
    eveningRoutine: "Somewhat consistent",
    learningInterests: "Various topics",
    preferredDuration: "Long (1+ hour)",
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
    };
    return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-8">
      {/* Print Button */}
      <div className="flex justify-end">
        <PrintButton
          contentRef={printRef}
          documentTitle="Survey Results"
          buttonText="Print Survey Results"
          variant="outline"
        />
      </div>

      {/* Hidden printable content */}
      <div className="hidden">
        <PrintableSurveyResults ref={printRef} />
      </div>
      {/* Personal Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Age Range</span>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                {surveyData.age}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gender</span>
              <Badge className="bg-yellow-50 yellow-700 border border-yellow-200">
                {surveyData.gender}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Activity Level</span>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                {surveyData.activityLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              Goals & Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Main Goals
              </span>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                {surveyData.mainGoals}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Most Important
              </span>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                {surveyData.mostImportantGoal}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Current Challenges
              </span>
              <Badge className="bg-red-50 text-red-700 border border-red-200">
                {surveyData.challenges}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Categories */}
      <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Favorite Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {surveyData.favoriteCategories.map((category, index) => (
              <Badge
                key={category}
                className={`${getCategoryColor(
                  category
                )} px-4 py-2 rounded-full font-medium hover:scale-105 transition-all duration-200 animate-fade-in border`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              Work & Study
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Work Style
              </span>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                {surveyData.workStudyStyle}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">Schedule</span>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                {surveyData.workSchedule}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Priority Area
              </span>
              <Badge className="bg-yellow-50 yellow-700 border border-yellow-200">
                {surveyData.priorityArea}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Time & Routines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Free Time
              </span>
              <div className="flex flex-wrap gap-2">
                {surveyData.freeTime.map((time) => (
                  <Badge
                    key={time}
                    className="bg-yellow-50 text-orange-800 border border-yellow-200"
                  >
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Sleep Schedule
              </span>
              <Badge className="bg-yellow-50 yellow-700 border border-yellow-200">
                {surveyData.sleepSchedule}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Preferred Duration
              </span>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                {surveyData.preferredDuration}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hobbies & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-300 to-rose-400 rounded-lg flex items-center justify-center mr-3">
                <Music className="w-4 h-4 text-white" />
              </div>
              Hobbies & Interests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">Hobbies</span>
              <div className="flex flex-wrap gap-2">
                {surveyData.hobbies.map((hobby) => (
                  <Badge
                    key={hobby}
                    className="bg-pink-50 text-pink-700 border border-amber-100 flex items-center gap-1"
                  >
                    {hobby === "Gaming" && <Gamepad className="w-3 h-3" />}
                    {hobby === "Music" && <Music className="w-3 h-3" />}
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Current Habits
              </span>
              <Badge className="bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                <Book className="w-3 h-3" />
                {surveyData.currentHabits}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center mr-3">
                <Home className="w-4 h-4 text-white" />
              </div>
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Preferred Environment
              </span>
              <div className="flex flex-wrap gap-2">
                {surveyData.preferredEnvironment.map((env) => (
                  <Badge
                    key={env}
                    className="bg-teal-50 text-teal-700 border border-teal-200"
                  >
                    {env}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm block mb-2">
                Social Preference
              </span>
              <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {surveyData.socialPreference}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routines */}
      <Card className="bg-white/80  border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center mr-3">
              <Sun className="w-4 h-4 text-white" />
            </div>
            Daily Routines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-800">
                  Morning Routine
                </span>
              </div>
              <Badge className="bg-green-100 text-green-700 border border-green-200">
                {surveyData.morningRoutine}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-800">
                  Evening Routine
                </span>
              </div>
              <Badge className="bg-yellow-100 yellow-700 border border-yellow-200">
                {surveyData.eveningRoutine}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyResults;
