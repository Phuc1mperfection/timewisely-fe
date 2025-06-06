import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import MainRoute from "./MainRoute";

const AppRoute = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/app/*" element={<MainRoute />} />
  </Routes>
);

export { AppRoute };
export default AppRoute;
