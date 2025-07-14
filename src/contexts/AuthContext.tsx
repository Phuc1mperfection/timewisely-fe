import React, { useState, useEffect } from "react";
import type { User } from "../interfaces/User";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
  loginWithGoogle,
  handleOAuthCallback,
} from "../services/authservices";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContextTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for OAuth2 callback in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const error = params.get("error");
    const scope = params.get("scope"); // Scope cho phép phân biệt các loại OAuth

    // Xử lý token chỉ khi đó là token đăng nhập (không có scope) hoặc token calendar
    if (token) {
      const processOAuthLogin = async () => {
        try {
          setLoading(true);
          localStorage.setItem("token", token);
          const userData = await getCurrentUser();
          setUser(userData);

          // Nếu là OAuth cho login, chuyển về dashboard
          // Nếu là OAuth cho calendar, ở lại trang hiện tại (đã được xử lý ở CalendarPage)
          if (!scope || !scope.includes("calendar")) {
            navigate("/dashboard", { replace: true });
          } else {
            // Xóa params khỏi URL nhưng giữ nguyên path hiện tại
            const currentPath = location.pathname;
            navigate(currentPath, { replace: true });
          }
        } catch (err) {
          console.error("OAuth login error:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          navigate("/auth", {
            replace: true,
            state: {
              oauthError: "Failed to complete login. Please try again.",
            },
          });
        } finally {
          setLoading(false);
        }
      };

      processOAuthLogin();
    } else if (error) {
      console.error("OAuth error:", error);
      // We'll handle the error display in PrivateRoute
    }
  }, [location, navigate]);

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
      navigate("/auth"); // Điều hướng về trang đăng nhập
    }
  };

  const handleOAuthCallbackFn = async (token: string, provider: string) => {
    setLoading(true);
    try {
      const userData = await handleOAuthCallback(token, provider);
      if (userData.token) localStorage.setItem("token", userData.token);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật token mới (dùng cho đổi email)
  const setToken = (token: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  // Add function to refresh user data
  const refreshUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
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
        loginWithGoogle,
        handleOAuthCallback: handleOAuthCallbackFn,
        setUser,
        setToken,
        getCurrentUser: refreshUser, // Add getCurrentUser function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
