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
    location: user.location || undefined,
    position: user.position || undefined,
    hobbies: user.hobbies || null,
    interests: user.interests || null,
    profileImageUrl: user.profileImageUrl || undefined,
    organization: user.organization?.name || undefined,
    accountStatus: user.isActive ? "Active" : "Inactive",
    pairingStatus: user.profileStatus || undefined,
    departmentId: user.departmentId || null,
  };

  const handleChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleSubmit = async (updatedProfile: UserProfile) => {
    try {
      const hobbyIds = Array.isArray(updatedProfile.hobbies)
        ? updatedProfile.hobbies.map((h) => h.id)
        : [];

      const interestIds = Array.isArray(updatedProfile.interests)
        ? updatedProfile.interests.map((i) => i.id)
        : [];

      await updateProfile({
        variables: {
          input: {
            firstName: updatedProfile.firstName || null,
            lastName: updatedProfile.lastName || null,
            about: updatedProfile.about || null,
            location: updatedProfile.location || null,
            position: updatedProfile.position || null,
            hobbyIds: hobbyIds,
            interestIds: interestIds,
            avatarUrl: updatedProfile.profileImageUrl || null,
            departmentId: updatedProfile.departmentId || null,
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
