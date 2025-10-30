import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  useGetCurrentUserQuery,
  type CurrentUserData,
} from "../auth/api/useGetCurrentUserQuery";
import ProfileForm from "./ProfileForm";
import SendResetPasswordButton from "../auth/components/SendResetPasswordButton";
import { UPDATE_USER_PROFILE } from "./UpdateUserProfileMutation";
import type { UserProfile } from "@/types/User";

const ProfileView = () => {
  const { data, loading, error } = useGetCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [updateProfile, { loading: mutationLoading }] =
    useMutation(UPDATE_USER_PROFILE);

  const user = data?.getCurrentUser ?? null;

  const mapUserToProfile = (user: CurrentUserData) =>
    ({
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      about: user.about || undefined,
      hobbies: user.hobbies
        ? user.hobbies.split(",").map((hobby) => hobby.trim())
        : [],
      interests: user.interests || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      pairingStatus: user.profileStatus || undefined,
      organization: user.organization?.name || undefined,
      accountStatus:
        user.isActive === undefined || user.isActive === null
          ? undefined
          : user.isActive
            ? "Active"
            : "Inactive",
    }) satisfies UserProfile;

  useEffect(() => {
    if (user) {
      setProfile(mapUserToProfile(user));
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">Error loading profile</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8 text-red-500">Error loading profile</div>
    );
  }

  if (!profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  const handleChange = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setProfile(mapUserToProfile(user));
  };

  const handleSubmit = async (updatedProfile: UserProfile) => {
    try {
      const hobbiesArray = Array.isArray(updatedProfile.hobbies)
        ? updatedProfile.hobbies
        : updatedProfile.hobbies
            ?.split(",")
            .map((hobby) => hobby.trim())
            .filter(Boolean) || [];

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

      setIsEditing(false);
    } catch (submitError) {
      console.error("Error updating profile:", submitError);
    }
  };

  return (
    <div>
      <ProfileForm
        value={profile}
        onChange={handleChange}
        readOnly={!isEditing}
        onSubmit={isEditing ? handleSubmit : undefined}
        submitLabel={mutationLoading ? "Saving..." : "Save Changes"}
        onEditClick={!isEditing ? handleEditClick : undefined}
      />
      {!isEditing && (
        <div className="mt-6 flex justify-center">
          <SendResetPasswordButton email={profile.email} variant="outline" />
        </div>
      )}
    </div>
  );
};

export default ProfileView;
