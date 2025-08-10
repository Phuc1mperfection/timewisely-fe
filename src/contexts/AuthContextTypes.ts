import { createContext } from "react";
import type { User } from "../interfaces/User";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | undefined>;
  register: (
    email: string,
    fullName: string,
    password: string
  ) => Promise<User | undefined>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  handleOAuthCallback: (token: string, provider: string) => Promise<User | undefined>;
  setUser?: (user: User | null) => void;
  setToken?: (token: string) => void;
  // Add getCurrentUser for refreshing user data after OAuth
  getCurrentUser?: () => Promise<User>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => {},
  loginWithGoogle: () => {},
  handleOAuthCallback: async () => undefined,
  setUser: undefined,
  setToken: undefined,
  getCurrentUser: async () => { throw new Error('Not implemented'); }
});
