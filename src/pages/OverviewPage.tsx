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
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-10 space-y-8">
        <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--wisely-dark)]">Dashboard</h1>
          <p className="text-[var(--wisely-gray)]">Welcome back! Here's your productivity overview.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--wisely-dark)]">Today's Schedule</CardTitle>
              <Clock className="h-4 w-4 text-[var(--wisely-purple)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--wisely-dark)]">3 events</div>
              <p className="text-xs text-[var(--wisely-gray)]">2 hours of free time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--wisely-dark)]">Active Goals</CardTitle>
              <Target className="h-4 w-4 text-[var(--wisely-mint)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--wisely-dark)]">5</div>
              <p className="text-xs text-[var(--wisely-gray)]">3 in progress</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--wisely-dark)]">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-[var(--wisely-pink)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--wisely-dark)]">78%</div>
              <p className="text-xs text-[var(--wisely-gray)]">Goals completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--wisely-dark)]">AI Suggestions</CardTitle>
              <Sparkles className="h-4 w-4 text-[var(--wisely-purple)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--wisely-dark)]">3 new</div>
              <p className="text-xs text-[var(--wisely-gray)]">Optimization tips</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/app/dashboard/calendar">
            <Card className="bg-white  hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <CalendarIcon className="h-8 w-8 text-[var(--wisely-purple)] mx-auto mb-2" />
                <CardTitle className="text-[var(--wisely-dark)]">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--wisely-gray)] text-center">Manage your schedule and events</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/app/dashboard/motivation">
            <Card className="bg-white  hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Sparkles className="h-8 w-8 text-[var(--wisely-mint)] mx-auto mb-2" />
                <CardTitle className="text-[var(--wisely-dark)]">Daily Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--wisely-gray)] text-center">Get inspired with daily quotes</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/app/dashboard/goals">
            <Card className="bg-white  hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Target className="h-8 w-8 text-[var(--wisely-pink)] mx-auto mb-2" />
                <CardTitle className="text-[var(--wisely-dark)]">Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--wisely-gray)] text-center">Track and achieve your objectives</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/app/dashboard/ai-suggestions">
            <Card className="bg-white  hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Sparkles className="h-8 w-8 text-[var(--wisely-purple)] mx-auto mb-2" />
                <CardTitle className="text-[var(--wisely-dark)]">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--wisely-gray)] text-center">Personalized optimization tips</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
      </div>
  );
}
