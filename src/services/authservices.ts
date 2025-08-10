import apiClient from "./apiClient";
import type { User } from "../interfaces/User";

export const login = async (email: string, password: string) => {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
};

export const register = async (
  email: string,
  fullName: string,
  password: string
) => {
  const res = await apiClient.post("/auth/register", {
    email,
    fullName,
    password,
  });
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout", {});
};

export const getOAuth2Config = async () => {
  const res = await apiClient.get("/api/auth/oauth2/config");
  return res.data;
};

export const loginWithGoogle = async () => {
  try {
    // Get the redirect URI from configuration if possible
    let redirectUri = `${window.location.origin}/auth`;

    try {
      const config = await getOAuth2Config();
      if (config.redirectUri) {
        redirectUri = config.redirectUri;
      }
    } catch (err) {
      console.warn(
        "Could not fetch OAuth config, using default redirect:",
        err
      );
    }

    // Add the redirect URI as a parameter
    const authUrl = new URL(
      `${import.meta.env.VITE_API_URL}/oauth2/authorize/google`
    );
    authUrl.searchParams.append("redirect_uri", redirectUri);

    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Error initializing Google login:", error);
    throw error;
  }
};

export const handleOAuthCallback = async (
  token: string,
  provider: string
): Promise<User> => {
  const res = await apiClient.post("/auth/oauth2/callback", {
    token,
    provider,
  });
  return res.data;
};
