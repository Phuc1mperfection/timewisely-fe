import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Calendar as CalendarIcon,
  ChevronRight,
  Home,
} from "lucide-react";

// Stat Card Component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Quick Action Card Component
function QuickActionCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link to={to}>
      <Card className="transition-all duration-200 hover:shadow-md cursor-pointer group">
        <CardHeader className="text-center pb-2">
          <Icon className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

// Breadcrumb Component
function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Home className="h-4 w-4" />
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">Overview</span>
    </nav>
  );
}

export function OverviewPage() {
  return (
    <div className="flex-1 container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumb />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Let's do something cool
          </p>
        </div>
      </div>

      <Separator />

      {/* Overview Stats */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Schedule"
            value="3 events"
            description="2 hours of free time"
            icon={Clock}
          />
          <StatCard
            title="Active Goals"
            value="5"
            description="3 in progress"
            icon={Target}
          />
          <StatCard
            title="Weekly Progress"
            value="78%"
            description="Goals completed"
            icon={TrendingUp}
          />
          <StatCard
            title="AI Suggestions"
            value="3 new"
            description="Optimization tips"
            icon={Sparkles}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            to="/dashboard/calendar"
            icon={CalendarIcon}
            title="Calendar"
            description="Manage your schedule and events"
          />
          <QuickActionCard
            to="/dashboard/motivation"
            icon={Sparkles}
            title="Daily Motivation"
            description="Get inspired with daily quotes"
          />
          <QuickActionCard
            to="/dashboard/goals"
            icon={Target}
            title="Goals"
            description="Track and achieve your objectives"
          />
          <QuickActionCard
            to="/dashboard/ai-suggestions"
            icon={Sparkles}
            title="AI Suggestions"
            description="Personalized optimization tips"
          />
        </div>
      </section>
    </div>
  );
}
