import { Link, useNavigate, useParams } from "react-router-dom";
import { Flag, Home, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProfileForm from "@/features/profile/ProfileForm";
import SendResetPasswordButton from "@/features/auth/components/SendResetPasswordButton";
import { useUserByIdQuery } from "@/features/users/api/useUserByIdQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import type { UserProfile } from "@/types/User";
import { useAuth } from "@/hooks/useAuth";
import BanUserDialog from "@/features/users/components/BanUserDialog";
import UnbanUserButton from "@/features/users/components/UnbanUserButton";
import ReportUserDialog from "@/features/users/components/ReportUserDialog";
import { useGetUserReceivedRatingsQuery } from "@/features/ratings/api/useGetUserReceivedRatingsQuery";
import { UserRatingsStatistics } from "@/features/ratings/components/UserRatingsStatistics";

const UserDetailPage = () => {
  const { appRole } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const encodedUserId = params.id ?? "";
  const userId = encodedUserId ? decodeURIComponent(encodedUserId) : undefined;

  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  const { data, loading, error } = useUserByIdQuery(userId);
  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUserQuery();

  const { data: ratingsData, error: ratingsError } = useGetUserReceivedRatingsQuery(
    isAdmin ? userId : undefined
  );

  const user = data?.userById ?? null;
  const isSelf = currentUserData?.getCurrentUser?.id === user?.id;
  const canReportUser = !isAdmin && !isSelf;

  const combinedLoading = loading || (!isAdmin && currentUserLoading);

  if (combinedLoading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Loading user...
        </h1>
      </div>
    );
  }

  if (error || currentUserError) {
    const message = error?.message || currentUserError?.message;
    const isForbiddenError = Boolean(
      message && /forbidden|permission/i.test(message)
    );

    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Unable to load user
        </h1>
        {message && (
          <p className="mt-2 text-sm text-muted-foreground">
            {isForbiddenError
              ? "This profile is no longer available. Either you reported this user or they reported you."
              : message}
          </p>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          User not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find a user for that link.
        </p>
      </div>
    );
  }

  if (isSelf) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          This is your profile
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You can manage your information from the profile page.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/profile">
              <Home className="mr-2 h-4 w-4" />
              Go to my profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const profile: UserProfile = {
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    location: user.location ?? undefined,
    profileImageUrl: user.profileImageUrl ?? undefined,
    pairingStatus: user.profileStatus ?? undefined,
  };

  const activeBan = user.activeBan ?? null;
  const userDisplayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.email;
  const isBanned = Boolean(activeBan);

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ProfileForm value={profile} />
      {activeBan && (
        <Alert variant="destructive" className="mt-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>User is banned</AlertTitle>
          <AlertDescription>
            {activeBan.reason}
            {activeBan.expiresAt
              ? ` — Ban expires ${new Date(
                  activeBan.expiresAt
                ).toLocaleString()}`
              : " — This ban does not expire"}
          </AlertDescription>
        </Alert>
      )}
      {isAdmin && (
        <>
          {ratingsError && (
            <Alert variant="destructive" className="mt-6">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Error loading ratings</AlertTitle>
              <AlertDescription>{ratingsError.message}</AlertDescription>
            </Alert>
          )}
          <UserRatingsStatistics data={ratingsData?.getUserReceivedRatings} />
        </>
      )}
      {canReportUser && (
        <div className="mt-6 flex justify-end">
          <ReportUserDialog
            reportedUserId={user.id}
            reportedUserName={userDisplayName}
            onReported={() => navigate("/user-list")}
          >
            {({ openDialog, loading }) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openDialog}
                disabled={loading}
                className="inline-flex items-center gap-2"
              >
                <Flag className="h-4 w-4" />
                {loading ? "Opening..." : "Report user"}
              </Button>
            )}
          </ReportUserDialog>
        </div>
      )}
      {isAdmin && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <SendResetPasswordButton email={user.email} variant="outline" />
          {isBanned ? (
            <UnbanUserButton userId={user.id} userDisplayName={userDisplayName}>
              {({ openDialog, loading }) => (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={openDialog}
                  disabled={loading}
                >
                  {loading ? "Working..." : "Unban user"}
                </Button>
              )}
            </UnbanUserButton>
          ) : (
            <BanUserDialog userId={user.id} userDisplayName={userDisplayName}>
              {({ openDialog, loading }) => (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={openDialog}
                  disabled={loading}
                >
                  {loading ? "Opening..." : "Ban user"}
                </Button>
              )}
            </BanUserDialog>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
