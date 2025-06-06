import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Auth from "../pages/Auth";
import MainRoute from "./MainRoute";

const AppRoute = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/app/*" element={<MainRoute />} />
  </Routes>
);

export { AppRoute };
export default AppRoute;
