import { useEffect, useState } from "react";

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
      if (err instanceof Error) {
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
      await updateProfile(values);
      await fetchProfile();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error updating profile");
      } else {
        setError("Error updating profil");
      }
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
      if (err instanceof Error) {
        setError(err.message || "Lỗi khi đổi mật khẩu");
      } else {
        setError("Lỗi khi đổi mật khẩu");
      }
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
