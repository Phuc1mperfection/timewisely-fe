import { useProfile } from "./useProfile";
import { useState } from "react";
import type { ProfileFormValues } from "../schemas/profileFormSchema";

export function useProfileUpdate() {
  const { handleUpdateProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      await handleUpdateProfile({
        fullName: data.fullname,
        email: data.email,
        // username, avatar nếu backend hỗ trợ
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
}
