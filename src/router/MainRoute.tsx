import { useAuth } from "@/contexts/useAuth";
import Dashboard from "../pages/Dashboard";
import Onboarding from "../pages/Onboarding";
import { PrivateRoute } from "../router/PrivateRoute";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

const MainRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  if (!user.hasCompletedSurvey && location.pathname !== "/app/onboarding") {
    return <Navigate to="/app/onboarding" replace />;
  }
  if (user.hasCompletedSurvey && location.pathname !== "/app/dashboard") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <PrivateRoute>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </PrivateRoute>
  );
};

export default MainRoute;
