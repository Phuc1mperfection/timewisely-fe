import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";

export function OverviewPage() {
  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-(--wisely-dark)">Overview</h1>
        <p className="text-(--wisely-gray)">Let's do something cool </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-yellow-300 shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-(--wisely-dark)">
              Today's Schedule
            </CardTitle>
            <Clock className="h-4 w-4 text-(--wisely-gold)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-(--wisely-dark)">
              3 events
            </div>
            <p className="text-xs text-(--wisely-gray)">2 hours of free time</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-yellow-300 shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-(--wisely-dark)">
              Active Goals
            </CardTitle>
            <Target className="h-4 w-4 text-(--wisely-champagne)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-(--wisely-dark)">5</div>
            <p className="text-xs text-(--wisely-gray)">3 in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-yellow-300 shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-(--wisely-dark)">
              Weekly Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-(--wisely-sand)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-(--wisely-dark)">78%</div>
            <p className="text-xs text-(--wisely-gray)">Goals completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-yellow-300 shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-(--wisely-dark)">
              AI Suggestions
            </CardTitle>
            <Sparkles className="h-4 w-4 text-(--wisely-gold)" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-(--wisely-dark)">3 new</div>
            <p className="text-xs text-(--wisely-gray)">Optimization tips</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/dashboard/calendar">
          <Card className="bg-white border border-yellow-300 shadow-sm  hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <CalendarIcon className="h-8 w-8 text-(--wisely-gold) mx-auto mb-2" />
              <CardTitle className="text-(--wisely-dark)">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--wisely-gray) text-center">
                Manage your schedule and events
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/motivation">
          <Card className="bg-white border border-yellow-300 shadow-sm  hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Sparkles className="h-8 w-8 text-(--wisely-champagne) mx-auto mb-2" />
              <CardTitle className="text-(--wisely-dark)">
                Daily Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--wisely-gray) text-center">
                Get inspired with daily quotes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/goals">
          <Card className="bg-white border border-yellow-300 shadow-sm  hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-(--wisely-sand) mx-auto mb-2" />
              <CardTitle className="text-(--wisely-dark)">Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--wisely-gray) text-center">
                Track and achieve your objectives
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/ai-suggestions">
          <Card className="bg-white border border-yellow-300 shadow-sm  hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Sparkles className="h-8 w-8 text-(--wisely-gold) mx-auto mb-2" />
              <CardTitle className="text-(--wisely-dark)">
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--wisely-gray) text-center">
                Personalized optimization tips
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
