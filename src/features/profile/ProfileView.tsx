import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useActivePauseQuery,
  useResumeActivityMutation,
} from "@/features/calendar/graphql/pause-activity.mutations";
import { PauseActivityModal } from "@/features/profile/components/PauseActivityModal";
import { ProfileAchievements } from "@/features/achievements";
import type { UpdateUserProfileMutation } from "@/graphql/generated/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/types/User";
import { useMutation } from "@apollo/client/react";
import { addYears, isAfter, parseISO, subDays } from "date-fns";
import { useEffect, useState } from "react";
import {
  type CurrentUserData,
  useGetCurrentUserQuery,
} from "../auth/api/useGetCurrentUserQuery";
import SendResetPasswordButton from "../auth/components/SendResetPasswordButton";
import ProfileForm from "./ProfileForm";
import { UPDATE_USER_PROFILE } from "./UpdateUserProfileMutation";

const mapUserToProfile = (user: CurrentUserData): UserProfile => {
  const hobbies = Array.isArray(user.hobbies) ? user.hobbies : [];
  const interests = Array.isArray(user.interests) ? user.interests : [];

  return {
    email: user.email,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    about: user.about || undefined,
    location: user.location || undefined,
    position: user.position || undefined,
    hobbies,
    interests,
    preferredActivity: user.preferredActivity || undefined,
    profileImageUrl: user.profileImageUrl || undefined,
    pairingStatus: user.profileStatus || undefined,
    organization: user.organization?.name || undefined,
    accountStatus:
      user.isActive === undefined || user.isActive === null
        ? undefined
        : user.isActive
          ? "Active"
          : "Inactive",
    departmentId: user.departmentId || null,
  } satisfies UserProfile;
};

const createPauseQueryVariables = () => {
  const now = new Date();
  const startDate = subDays(now, 7); // look back a week for active pauses
  const endDate = addYears(now, 10); // generous future window to find pauses

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

const pauseQueryVariables = createPauseQueryVariables();

const ProfileView = () => {
  const { data, loading, error } = useGetCurrentUserQuery();
  const { appRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [updateProfile, { loading: mutationLoading }] =
    useMutation(UPDATE_USER_PROFILE);
  const [showPauseModal, setShowPauseModal] = useState(false);

  const user = data?.getCurrentUser ?? null;

  // Only show pause activity for regular members (not admins)
  const canBePaired = appRole !== "org_admin" && appRole !== "super_admin";

  // Create now for comparisons (this can change on each render since it's just for comparison logic)
  const now = new Date();

  const { data: pauseData } = useActivePauseQuery(pauseQueryVariables);

  const activePause = pauseData?.expandedCalendarOccurrences?.find((occ) => {
    // Check if the pause is currently active or upcoming
    const occurrenceEnd = parseISO(occ.occurrenceEnd);
    const isCurrentOrFuture = isAfter(occurrenceEnd, now);

    return (
      occ?.originalEvent?.type === "unavailability" &&
      occ?.originalEvent?.title === "Activity Paused" &&
      !occ?.originalEvent?.deletedAt &&
      isCurrentOrFuture
    );
  });

  // Resume activity mutation
  const { toast } = useToast();
  const [resumeActivity, { loading: resumeLoading }] =
    useResumeActivityMutation();

  const handleResumeActivity = async () => {
    try {
      await resumeActivity({
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
      const hobbyIds = Array.isArray(updatedProfile.hobbies)
        ? updatedProfile.hobbies.map((h) => h.id)
        : [];

      const interestIds = Array.isArray(updatedProfile.interests)
        ? updatedProfile.interests.map((i) => i.id)
        : [];

      const result = await updateProfile({
        variables: {
          input: {
            firstName: updatedProfile.firstName || null,
            lastName: updatedProfile.lastName || null,
            about: updatedProfile.about || null,
            location: updatedProfile.location || null,
            position: updatedProfile.position || null,
            hobbyIds: hobbyIds,
            interestIds: interestIds,
            preferredActivity: updatedProfile.preferredActivity || null,
            // Send the actual URL string, or null if it doesn't exist
            // This ensures the backend receives the Supabase URL correctly
            avatarUrl:
              updatedProfile.profileImageUrl &&
              updatedProfile.profileImageUrl.trim()
                ? updatedProfile.profileImageUrl.trim()
                : null,
            departmentId: updatedProfile.departmentId || null,
          },
        },
        refetchQueries: ["GetCurrentUser"],
        awaitRefetchQueries: true, // Wait for refetch to complete
      });

      // Update local profile state immediately with mutation response
      // This ensures the image displays correctly even before refetch completes
      const mutationData = result.data as UpdateUserProfileMutation | undefined;
      if (mutationData?.updateCurrentUserProfile) {
        const updatedUser = mutationData.updateCurrentUserProfile;
        setProfile(mapUserToProfile(updatedUser as CurrentUserData));
      }

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
          {/* Department Section */}
          {user.department && (
            <div className="rounded-lg border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground mb-2">Department</p>
              <Badge variant="secondary">{user.department.name}</Badge>
            </div>
          )}

          {/* Pause Activity Section - Only for regular members */}
          {canBePaired && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Pairing Availability</h3>
              {!activePause ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    ✅ Active and will be included in next pairing
                  </p>
                  <Button
                    onClick={() => setShowPauseModal(true)}
                    disabled={mutationLoading}
                  >
                    {mutationLoading ? "Pausing..." : "Pause Activity"}
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
          )}

          {/* Achievements Section */}
          <div className="border-t pt-6">
            <ProfileAchievements showProgress={true} />
          </div>

          {/* Reset Password Section */}
          <div className="flex justify-center">
            <SendResetPasswordButton email={profile.email} variant="outline" />
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
