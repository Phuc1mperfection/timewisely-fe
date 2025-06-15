import apiClient from "./apiClient";
import type { User } from "../interfaces/User";
import type { ProfileUpdateResponse } from "../interfaces/ProfileUpdateResponse";

export const getProfile = async (): Promise<{ userProfile: User }> => {
  const res = await apiClient.get("/users/profile");
  return res.data;
};

export const updateProfile = async (values: { fullName: string; email: string }): Promise<ProfileUpdateResponse> => {
  const res = await apiClient.put("/users/profile", values);
  console.log("Profile update API response:", res.data);
  // Return both user and token if available
  return res.data;
};

export const changePassword = async (values: { currentPassword: string; newPassword: string; reEnterPassword: string }) => {
  try {
    const res = await apiClient.post("/users/change-password", values);
    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
