import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "@/interfaces/User";

export function useAuth() {
  return useContext(AuthContext) as {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<User | undefined>;
    register: (email: string, fullName: string, password: string) => Promise<User | undefined>;
    logout: () => Promise<void>;
  };
}
