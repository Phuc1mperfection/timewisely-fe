import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Target,
  Zap,
  Briefcase,
  Clock,
  Music,
  Home,
  Sun,
  Moon,
} from "lucide-react";

const PrintableSurveyResults = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
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
        "Work/Productivity": "bg-orange-100 text-orange-800",
        Fitness: "bg-green-100 text-green-800",
        "Learning/Education": "bg-yellow-100 yellow-800",
        "Mindfulness/Wellness": "bg-amber-50 text-pink-800",
        "Social/Family": "bg-orange-100 text-orange-800",
        "Cooking/Nutrition": "bg-yellow-100 text-yellow-800",
        Creative: "bg-orange-200 text-orange-900",
      };
      return colorMap[category] || "bg-gray-100 text-gray-800";
    };

    return (
      <div ref={ref} className="print-content bg-white p-6 space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Survey Results
          </h1>
          <p className="text-gray-600">Personal Assessment Summary</p>
          <p className="text-sm text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Age Range:</span>
                <Badge className={getCategoryColor("Work/Productivity")}>
                  {surveyData.age}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Gender:</span>
                <Badge className={getCategoryColor("Learning/Education")}>
                  {surveyData.gender}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Activity Level:</span>
                <Badge className={getCategoryColor("Fitness")}>
                  {surveyData.activityLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Target className="w-5 h-5 mr-2" />
                Goals & Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Main Goals:</span>
                <Badge className={getCategoryColor("Mindfulness/Wellness")}>
                  {surveyData.mainGoals}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Most Important:</span>
                <Badge className={getCategoryColor("Work/Productivity")}>
                  {surveyData.mostImportantGoal}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Current Challenges:
                </span>
                <Badge className="bg-red-100 text-red-800">
                  {surveyData.challenges}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Favorite Categories */}
        <Card className="border mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Favorite Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {surveyData.favoriteCategories.map((category) => (
                <Badge
                  key={category}
                  className={`${getCategoryColor(category)} px-3 py-1`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work & Schedule */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Briefcase className="w-5 h-5 mr-2" />
                Work & Study
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Work Style:</span>
                <Badge className={getCategoryColor("Work/Productivity")}>
                  {surveyData.workStudyStyle}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Schedule:</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {surveyData.workSchedule}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Priority Area:</span>
                <Badge className={getCategoryColor("Learning/Education")}>
                  {surveyData.priorityArea}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Time & Routines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Free Time:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {surveyData.freeTime.map((time) => (
                    <Badge
                      key={time}
                      className="bg-orange-200 text-orange-900 text-xs"
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Sleep Schedule:</span>
                <Badge className={getCategoryColor("Mindfulness/Wellness")}>
                  {surveyData.sleepSchedule}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Preferred Duration:
                </span>
                <Badge className={getCategoryColor("Fitness")}>
                  {surveyData.preferredDuration}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hobbies & Preferences */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Music className="w-5 h-5 mr-2" />
                Hobbies & Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Hobbies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {surveyData.hobbies.map((hobby) => (
                    <Badge key={hobby} className="bg-amber-50 text-pink-800">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Current Habits:</span>
                <Badge className={getCategoryColor("Learning/Education")}>
                  {surveyData.currentHabits}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Home className="w-5 h-5 mr-2" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Environment:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {surveyData.preferredEnvironment.map((env) => (
                    <Badge
                      key={env}
                      className="bg-teal-100 text-teal-800 text-xs"
                    >
                      {env}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  Social Preference:
                </span>
                <Badge className="bg-cyan-100 text-cyan-800">
                  {surveyData.socialPreference}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Routines */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Sun className="w-5 h-5 mr-2" />
              Daily Routines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Morning Routine</span>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {surveyData.morningRoutine}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium">Evening Routine</span>
                </div>
                <Badge className="bg-yellow-100 yellow-800">
                  {surveyData.eveningRoutine}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

PrintableSurveyResults.displayName = "PrintableSurveyResults";

export default PrintableSurveyResults;
