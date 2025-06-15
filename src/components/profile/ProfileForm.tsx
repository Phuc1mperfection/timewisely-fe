import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/useAuth";
import { useProfileUpdate } from "../../hooks/useProfileUpdate";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "../../schemas/profileFormSchema";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { AvatarSection } from "./AvatarSection";
import { Card } from "../ui/card";
import { useToast } from "../../hooks/useToast";
import { useProfile } from "../../hooks/useProfile";
import { useState } from "react";
import type { ProfileUpdateResponse } from "../../interfaces/ProfileUpdateResponse";

export function ProfileForm() {
  const { user, setUser, setToken } = useAuth();
  const { updateProfile, isLoading } = useProfileUpdate();
  const { error } = useProfile();
  const toast = useToast();
  const [displayFullName, setDisplayFullName] = useState(user?.fullName || "");

  const defaultValues: Partial<ProfileFormValues> = {
    email: user?.email || "",
    fullName: user?.fullName || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  async function onSubmit(data: ProfileFormValues) {
    try {
      const response: ProfileUpdateResponse = await updateProfile({
        fullName: data.fullName,
        email: data.email,
      });
      console.log("Update profile response:", response);
      setDisplayFullName(data.fullName);
      // Handle the updated profile response that follows the ProfileUpdateResponse interface
      if (user && setUser) {
        // Check if we got a token in the response (email was changed)
        if (response && response.token && setToken) {
          console.log(
            "Found token in response, updating token in localStorage"
          );
          setToken(response.token);
        }

        // Update the user in the context with the new user data from response
        if (response && response.user) {
          console.log(
            "Updating user in AuthContext with response data",
            response.user
          );
          setUser({
            ...user,
            ...response.user,
            email: response.user.email || data.email,
            fullName: response.user.fullName || data.fullName,
          });
        } else {
          // Fallback if we don't get user data in the response
          console.log("Updating user in AuthContext with form data");
          setUser({ ...user, email: data.email, fullName: data.fullName });
        }
      }
      toast.success(
        "Profile updated successfully. You're still logged in with your new details."
      );
    } catch {
      toast.error(error || "Có lỗi xảy ra khi cập nhật thông tin!");
    }
  }

  // const handleAvatarChange = (filename: string) => {
  //   form.setValue("avatar", filename);
  //   form.handleSubmit(onSubmit)();
  // };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <AvatarSection
          username={user?.username}
          fullName={displayFullName || user?.fullName}
          // onAvatarChange={handleAvatarChange}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email"
              />
              <FormFieldWrapper
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Full Name"
              />
              {/* <input type="hidden" {...form.register("avatar")} /> */}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  const values = form.getValues();
                  console.log("Submit values:", values);
                  form.handleSubmit(onSubmit)();
                }}
              >
                {isLoading ? "Loading" : "Update Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default ProfileForm;
