import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Let's do something cool
        </p>
      </div>

      <Separator />

      {/* Overview Stats */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Schedule
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 events</div>
              <p className="text-xs text-muted-foreground">
                2 hours of free time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Goals
              </CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">3 in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Weekly Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">Goals completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Suggestions
              </CardTitle>
              <Sparkles className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 new</div>
              <p className="text-xs text-muted-foreground">
                Optimization tips
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/calendar">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <CalendarIcon className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Manage your schedule and events
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/motivation">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Daily Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Get inspired with daily quotes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/goals">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Track and achieve your objectives
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/ai-suggestions">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Personalized optimization tips
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
