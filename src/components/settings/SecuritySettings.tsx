import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { type FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";

export function SecuritySettings() {
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);
    // const form = event.target as HTMLFormElement;
    // const formData = new FormData(form);
    // const currentPassword = formData.get("currentPassword") as string;
    // const newPassword = formData.get("newPassword") as string;
    // const confirmNewPassword = formData.get("confirmNewPassword") as string;
    // try {
    //   await authService.changePassword({ currentPassword, newPassword, confirmNewPassword });
    //   form.reset();
    // } catch (error) {
    //   console.error("Password change failed:", error);
    // } finally {
    //   setIsSavingPassword(false);
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h3 className="text-base font-medium">Change Password</h3>
          <div className="grid gap-4">
            <div className="relative">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showCurrentPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <div className="relative">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[50%] -translate-y-[50%] text-gray-400 hover:text-gray-600 dark:hover:text-white transition duration-200"
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <Button type="submit" disabled={isSavingPassword}>
            {isSavingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="text-base font-medium">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account. (Not
                implemented)
              </p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SecuritySettings;
