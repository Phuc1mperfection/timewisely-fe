import { useAuth } from "@/contexts/useAuth";
import Dashboard from "../pages/Dashboard";
import Onboarding from "../pages/Onboarding";
import { PrivateRoute } from "../router/PrivateRoute";

const MainRoute = () => {
  const { user } = useAuth();
  return (
    <PrivateRoute>
      {user?.hasCompletedSurvey ? <Dashboard /> : <Onboarding />}
    </PrivateRoute>
  );
};

export default MainRoute;
