import { useContext } from "react";
import { AuthContext } from "./AuthContextTypes";
import type { AuthContextType } from "./AuthContextTypes";

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
