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
  setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => {},
  setUser: undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper: kiểm tra token trong localStorage/cookie
  const hasAuthToken = () => {
    // Tùy backend, có thể là localStorage hoặc cookie
    return (
      !!localStorage.getItem("token") || !!localStorage.getItem("refreshToken")
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      // Nếu không có token, logout luôn
      if (!hasAuthToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err: unknown) {
        setUser(null);
        // Nếu lỗi 401 thì logout luôn
        interface ApiError {
          response?: {
            status?: number;
          };
        }
        if (
          typeof err === "object" &&
          err &&
          "response" in err &&
          (err as ApiError).response?.status === 401
        ) {
          await logout();
        }
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
      // Lưu token nếu backend trả về
      if (userData.token) localStorage.setItem("token", userData.token);
      setUser(userData);
      if (userData.hasCompletedSurvey !== undefined) {
        localStorage.setItem(
          "hasCompletedSurvey",
          String(userData.hasCompletedSurvey)
        );
      }
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
      if (userData.token) localStorage.setItem("token", userData.token);
      setUser(userData);
      if (userData.hasCompletedSurvey !== undefined) {
        localStorage.setItem(
          "hasCompletedSurvey",
          String(userData.hasCompletedSurvey)
        );
      }
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
    } finally {
      // Xóa token khỏi localStorage/cookie
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("hasCompletedSurvey");
      // Cập nhật state user
      setUser(null);
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
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
