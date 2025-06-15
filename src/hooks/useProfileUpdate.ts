import { useProfile } from "./useProfile";
import { useState } from "react";
import type { ProfileFormValues } from "../schemas/profileFormSchema";

export function useProfileUpdate() {
  const { handleUpdateProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Trả về response để lấy token mới nếu có
      return await handleUpdateProfile({
        fullName: data.fullName,
        email: data.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
}
