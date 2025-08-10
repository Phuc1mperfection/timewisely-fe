import { useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContextTypes";
import { useToast } from "@/hooks/useToast";

export const PrivateRoute = ({
  children,
  onlyGuest = false,
}: {
  children: ReactNode;
  onlyGuest?: boolean;
}) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const location = useLocation();
  const { error: showError } = useToast();

  // Handle OAuth errors
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error) {
      console.error("OAuth error:", error);
      showError(`Authentication failed: ${error.split(";")[0]}`);
    }
  }, [location, showError]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wisely-blue"></div>
      </div>
    );

  if (onlyGuest && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAuthenticated && !onlyGuest) return <Navigate to="/auth" replace />;

  // Nếu chưa hoàn thành survey, chỉ cho phép vào /onboarding
  if (user && !user.hasCompletedSurvey && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
