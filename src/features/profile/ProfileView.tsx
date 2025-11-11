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
import { Button } from "@/components/ui/button";
import { PauseActivityModal } from "@/features/profile/components/PauseActivityModal";
import {
  useActivePauseQuery,
  useResumeActivityMutation,
} from "@/features/calendar/graphql/pause-activity.mutations";
import { useToast } from "@/hooks/use-toast";

const ProfileView = () => {
  const { data, loading, error } = useGetCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [updateProfile, { loading: mutationLoading }] =
    useMutation(UPDATE_USER_PROFILE);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const user = data?.getCurrentUser ?? null;

  // Query for active pause events
  const now = new Date();
  const farFuture = new Date();
  farFuture.setFullYear(farFuture.getFullYear() + 10);
  const { data: pauseData } = useActivePauseQuery({
    startDate: now.toISOString(),
    endDate: farFuture.toISOString(),
  }) as {
    data?: {
      expandedCalendarOccurrences?: Array<{
        id: string;
        occurrenceStart: string;
        occurrenceEnd: string;
        originalEvent: {
          id: string;
          type: string;
          title: string;
          description?: string;
          startDateTime: string;
          endDateTime: string;
          deletedAt?: string | null;
        };
      }>;
    };
  };

  const activePause = pauseData?.expandedCalendarOccurrences?.find(
    (occ) =>
      occ?.originalEvent?.type === "unavailability" &&
      occ?.originalEvent?.title === "Activity Paused" &&
      !occ?.originalEvent?.deletedAt
  );

  // Resume activity mutation
  const { toast } = useToast();
  const [resumeActivity, { loading: resumeLoading }] =
    useResumeActivityMutation();

  const handleResumeActivity = async () => {
    if (!activePause?.originalEvent.id) return;

    try {
      await resumeActivity({
        variables: {
          eventId: activePause.originalEvent.id,
        },
        refetchQueries: ["GetActivePause"],
      });

      toast({
        title: "Success",
        description: "Your activity has been resumed",
      });
    } catch (err) {
      console.error("Error resuming activity:", err);
      toast({
        title: "Error",
        description: "Failed to resume activity",
        variant: "destructive",
      });
    }
  };

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
        <div className="mt-6 space-y-4">
          <div className="flex justify-center">
            <SendResetPasswordButton email={profile.email} variant="outline" />
          </div>

          {/* Pause Activity Section */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Pairing Availability</h3>
            {!activePause ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  ✅ Active and will be included in next pairing
                </p>
                <Button onClick={() => setShowPauseModal(true)}>
                  Pause Activity
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 space-y-3">
                <p className="text-sm font-medium text-yellow-900">
                  ⏸️ Your activity is paused
                </p>
                {activePause.originalEvent.description && (
                  <p className="text-sm text-yellow-700">
                    {activePause.originalEvent.description}
                  </p>
                )}
                <Button
                  onClick={handleResumeActivity}
                  disabled={resumeLoading}
                  variant="outline"
                >
                  {resumeLoading ? "Resuming..." : "Resume Activity"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <PauseActivityModal
        open={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        onSuccess={() => {
          setShowPauseModal(false);
          // Refetch is handled by Apollo cache on mutation
        }}
      />
    </div>
  );
};

export default ProfileView;
