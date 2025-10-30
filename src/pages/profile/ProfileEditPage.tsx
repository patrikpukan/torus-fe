import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery.ts";
import ProfileForm from "../../features/profile/ProfileForm";
import { UPDATE_USER_PROFILE } from "@/features/profile/UpdateUserProfileMutation.ts";
import type { UserProfile } from "@/types/User.ts";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data, loading: queryLoading } = useGetCurrentUserQuery();
  const [updateProfile, { loading: mutationLoading }] =
    useMutation(UPDATE_USER_PROFILE);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  if (queryLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!data?.getCurrentUser) {
    return (
      <div className="text-center py-8 text-red-500">Error loading profile</div>
    );
  }

  const user = data.getCurrentUser;

  const initialProfile: UserProfile = profile || {
    email: user.email,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    about: user.about || undefined,
    hobbies: user.hobbies ? user.hobbies.split(",").map((h) => h.trim()) : [],
    interests: user.interests || undefined,
    profileImageUrl: user.profileImageUrl || undefined,
    organization: user.organization?.name || undefined,
    accountStatus: user.isActive ? "Active" : "Inactive",
    pairingStatus: user.profileStatus || undefined,
  };

  const handleChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleSubmit = async (updatedProfile: UserProfile) => {
    try {
      const hobbiesArray = Array.isArray(updatedProfile.hobbies)
        ? updatedProfile.hobbies
        : updatedProfile.hobbies?.split(",").map((h) => h.trim()) || [];

      await updateProfile({
        variables: {
          input: {
            firstName: updatedProfile.firstName || null,
            lastName: updatedProfile.lastName || null,
            about: updatedProfile.about || null,
            hobbies: hobbiesArray.join(", ") || null,
            interests: updatedProfile.interests || null,
            avatarUrl: updatedProfile.profileImageUrl || null,
          },
        },
        refetchQueries: ["GetCurrentUser"],
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold mb-4">Edit Profile</h1>
      <ProfileForm
        value={initialProfile}
        onChange={handleChange}
        readOnly={false}
        onSubmit={handleSubmit}
        submitLabel={mutationLoading ? "Saving..." : "Save Changes"}
      />
    </div>
  );
};

export default ProfileEditPage;
