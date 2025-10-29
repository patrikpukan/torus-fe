import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "../auth/api/useGetCurrentUserQuery";
import ProfileForm from "./ProfileForm";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../../types/User";

const ProfileView = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useGetCurrentUserQuery();

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error || !data?.getCurrentUser) {
    return (
      <div className="text-center py-8 text-red-500">Error loading profile</div>
    );
  }

  const user = data.getCurrentUser;

  const profile: UserProfile = {
    email: user.email,
    name: user.firstName || undefined,
    surname: user.lastName || undefined,
    about: user.about || undefined,
    hobbies: user.hobbies ? user.hobbies.split(",").map((h) => h.trim()) : [],
    meetingActivity: user.preferredActivity || undefined,
    interests: user.interests || undefined,
    username: user.username || undefined,
    displayUsername: user.displayUsername || undefined,
    profileImageUrl: user.profileImageUrl || undefined,
    pairingStatus: user.profileStatus || undefined,
    organization: user.organization?.name || undefined,
    accountStatus: user.isActive ? "Active" : "Inactive",
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/profile-edit")}>Edit Profile</Button>
      </div>
      <ProfileForm value={profile} readOnly />
    </div>
  );
};

export default ProfileView;
