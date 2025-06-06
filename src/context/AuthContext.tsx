import React, { createContext, useState, useEffect } from "react";
import type { User } from "../interfaces/User";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
} from "../services/authservices";

interface AuthContextType {
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await loginService(email, password);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    fullName: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const userData = await registerService(email, fullName, password);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
