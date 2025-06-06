import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Auth from "../pages/Auth";
import MainRoute from "./MainRoute";
import Unauthorized from "../pages/Unauthorized";

const AppRoute = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/app/*" element={<MainRoute />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path="/dashboard" element={<Navigate to="/app" replace />} />
    <Route path="/onboarding" element={<Navigate to="/app" replace />} />
  </Routes>
);

export { AppRoute };
export default AppRoute;
