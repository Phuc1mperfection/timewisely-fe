import { useEffect, useState } from "react";
import { AxiosError } from "axios";

interface Profile {
  fullName: string;
  email: string;
}

interface UpdateProfileValues {
  fullName: string;
  email: string;
}

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  reEnterPassword: string;
}
import { getProfile, updateProfile, changePassword } from "../services/userServices";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile({
        fullName: data.userProfile.fullName ?? "",
        email: data.userProfile.email ?? ""
      });
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message || "Error fetching user profile");
      } else {
        setError("Error fetching user profile");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateProfile = async (values: UpdateProfileValues) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateProfile(values);
      
      // Only refetch profile if the response doesn't contain user data
      // If response has user data, the ProfileForm will update the user directly
      if (!response.user && !response.token) {
        await fetchProfile();
      }
      
      return response;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message || "Error updating profile");
      } else {
        setError("Error updating profile");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async (values: ChangePasswordValues) => {
    setLoading(true);
    setError(null);
    try {
      await changePassword(values);
    } catch (err) {
      let errorMessage: string;
      
      if (err instanceof AxiosError && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message || "Error changing password";
      } else {
        errorMessage = "Error changing password";
      }
      
      setError(errorMessage);
      throw new Error(errorMessage); // Rethrow the error with a clearer message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    handleUpdateProfile,
    handleChangePassword,
  };
}
