import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Unauthorized from "@/pages/Unauthorized";
import { PrivateRoute } from "@/router/PrivateRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import CalendarPage from "@/pages/CalendarPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { DashboardContent } from "./pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />

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
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/app/onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            <Route
              path="/app/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout children={undefined} />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardContent />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="goals" element={<div>Goals Page</div>} />
              <Route path="profile" element={<div>Profile Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              {/* ...thêm các page con khác tại đây */}
            </Route>
           
            {/* Redirect /app và /app/* về dashboard nếu không khớp route con */}
            <Route
              path="/app"
              element={<Navigate to="/app/dashboard" replace />}
            />
            <Route
              path="/app/*"
              element={<Navigate to="/app/dashboard" replace />}
            />
            {/* Thêm các route khác tại đây nếu cần */}
            <Route path="*" element={<Auth />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
