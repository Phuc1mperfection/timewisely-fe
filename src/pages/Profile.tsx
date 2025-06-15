import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import ProfileForm from "../components/profile/ProfileForm";
import SecuritySettings from "../components/settings/SecuritySettings";
import { useAuth } from "../contexts/useAuth";

const Profile = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <div>Loading profile...</div>;
  }
  if (user === null) {
    return (
      <div className="container max-w-4xl mx-auto py-6 space-y-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Please log in to manage your account settings.
        </p>
      </div>
    );
  }

  return (
      <div className="flex-1 p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-fit">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>  
  );
};

export default Profile;
