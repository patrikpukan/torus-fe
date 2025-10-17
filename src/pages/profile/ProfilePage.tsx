import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCalendar from "../../features/calendar/ProfileCalendar";
import ProfileView from "../../features/profile/ProfileView";

const ProfilePage = () => {
  return (
    <div className="mx-auto max-w-3xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0">
          <ProfileView />
        </TabsContent>
        <TabsContent value="calendar" className="mt-0">
          <ProfileCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
