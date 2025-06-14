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

export function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isLoading } = useProfileUpdate();

  const defaultValues: Partial<ProfileFormValues> = {
    username: user?.username || "",
    email: user?.email || "",
    fullname: user?.fullName || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
  }

  const handleAvatarChange = (filename: string) => {
    form.setValue("avatar", filename);
    form.handleSubmit((data) => {
      updateProfile(data);
    })();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <AvatarSection
          username={user?.username}
          onAvatarChange={handleAvatarChange}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormFieldWrapper
                control={form.control}
                name="username"
                label="Username"
                placeholder="Username"
              />
              <FormFieldWrapper
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email"
              />
              <FormFieldWrapper
                control={form.control}
                name="fullname"
                label="Full Name"
                placeholder="Full Name"
              />
              <input type="hidden" {...form.register("avatar")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
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
