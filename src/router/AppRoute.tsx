import { Routes, Route } from "react-router-dom";
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
  </Routes>
);

export { AppRoute };
export default AppRoute;
