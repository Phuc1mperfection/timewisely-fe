import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import LandingPage from "@/pages/LandingPage";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Unauthorized from "@/pages/Unauthorized";
import { PrivateRoute } from "@/router/PrivateRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import CalendarPage from "@/pages/CalendarPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { DashboardContent } from "./pages/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PomodoroPage from "./pages/PomodoroPage";
import { TodayTasksPage } from "./pages/tasks/TodayTasksPage";
import { UpcomingTasksPage } from "./pages/tasks/UpcomingTasksPage";
import { CompletedTasksPage } from "./pages/tasks/CompletedTasksPage";
import { InboxTasksPage } from "./pages/tasks/InboxTasksPage";
import { SettingsPage } from "./pages/SettingsPage";
import GoalsPage from "./pages/GoalsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <NotificationProvider>
              <Toaster position="top-center" richColors />
              {/* You can place <ModeToggle /> in your layout or header for theme switching */}
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/auth"
                  element={
                    <PrivateRoute onlyGuest={true}>
                      <Auth />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/auth/forgot-password/otp"
                  element={<VerifyOtpPage />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPasswordPage />}
                />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route
                  path="/onboarding"
                  element={
                    <PrivateRoute>
                      <Onboarding />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <DashboardLayout children={undefined} />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<DashboardContent />} />
                  <Route path="overview" element={<OverviewPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route
                    path="tasks"
                    element={<Navigate to="/dashboard/tasks/inbox" replace />}
                  />
                  <Route path="tasks/inbox" element={<InboxTasksPage />} />
                  <Route path="tasks/today" element={<TodayTasksPage />} />
                  <Route
                    path="tasks/upcoming"
                    element={<UpcomingTasksPage />}
                  />
                  <Route
                    path="tasks/completed"
                    element={<CompletedTasksPage />}
                  />
                  <Route path="pomodoro" element={<PomodoroPage />} />
                  <Route path="goals" element={<GoalsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<SettingsPage />} />
                  {/* ...thêm các page con khác tại đây */}
                </Route>
                {/* Redirect các route cũ về route mới nếu cần */}
                <Route
                  path="/app"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/app/*"
                  element={<Navigate to="/dashboard" replace />}
                />
                {/* Thêm các route khác tại đây nếu cần */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
