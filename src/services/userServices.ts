import apiClient from "./apiClient";
import type { User } from "../interfaces/User";

export const getProfile = async (): Promise<{ userProfile: User }> => {
  const res = await apiClient.get("/api/users/profile");
  return res.data;
};

export const updateProfile = async (values: { fullName: string; email: string }) => {
  await apiClient.put("/api/users/profile", values);
};

export const changePassword = async (values: { currentPassword: string; newPassword: string; reEnterPassword: string }) => {
  await apiClient.post("/api/users/change-password", values);
};
