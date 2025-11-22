import { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { EyeOff, Flag, Home, ShieldAlert } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProfileForm from "@/features/profile/ProfileForm";
import SendResetPasswordButton from "@/features/auth/components/SendResetPasswordButton";
import { useUserByIdQuery } from "@/features/users/api/useUserByIdQuery";
import { useGetPairedUsersQuery } from "@/features/users/api/useGetPairedUsersQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import type { UserProfile } from "@/types/User";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import BanUserDialog from "@/features/users/components/BanUserDialog";
import UnbanUserButton from "@/features/users/components/UnbanUserButton";
import ReportUserDialog from "@/features/users/components/ReportUserDialog";

const UserDetailPage = () => {
  const { appRole } = useAuth();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const encodedUserId = params.id ?? "";
  const userId = encodedUserId ? decodeURIComponent(encodedUserId) : undefined;

  const isAdmin = appRole === "org_admin" || appRole === "super_admin";

  const { data, loading, error } = useUserByIdQuery(userId);
  const {
    data: pairedData,
    loading: pairedLoading,
    error: pairedError,
  } = useGetPairedUsersQuery();
  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUserQuery();

  const queryMode = new URLSearchParams(location.search).get("mode");
  const anonymizeByParam = queryMode === "incognito";

  const pairedIds = useMemo(() => {
    const ids = new Set<string>();
    pairedData?.getPairedUsers?.forEach((user) => {
      ids.add(user.id);
    });
    return ids;
  }, [pairedData]);

  const user = data?.userById ?? null;
  const currentUserId = currentUserData?.getCurrentUser?.id;
  const isSelf = Boolean(user && currentUserId && user.id === currentUserId);

  const pairedInfoResolved = !pairedLoading && !currentUserLoading;
  const isPaired = Boolean(user && pairedIds.has(user.id));

  const shouldMask =
    !isAdmin &&
    !isSelf &&
    (!pairedInfoResolved || !isPaired || anonymizeByParam);
  const canReportUser = !isAdmin && !isSelf && !shouldMask;

  const combinedLoading =
    loading || (!isAdmin && (pairedLoading || currentUserLoading));

  if (combinedLoading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Loading user...
        </h1>
      </div>
    );
  }

  if (error || pairedError || currentUserError) {
    const message =
      error?.message || pairedError?.message || currentUserError?.message;
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

  if (shouldMask) {
    const maskedHobbies = Array.isArray(user.hobbies)
      ? user.hobbies.map((h) => h.name).join(", ") || null
      : null;
    const maskedInterests = Array.isArray(user.interests)
      ? user.interests.map((i) => i.name).join(", ") || null
      : null;

    const renderMaskedField = (
      label: string,
      value: string | null,
      placeholder: string
    ) => (
      <div className="space-y-2 rounded-md border border-muted-foreground/20 bg-card/60 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <p className="text-sm text-foreground">{value ?? placeholder}</p>
      </div>
    );

    return (
      <div className="mx-auto max-w-3xl space-y-8 py-12">
        <div className="flex flex-col items-center gap-6 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 px-6 py-12 text-center shadow-sm">
          <Avatar
            className={cn(
              "h-24 w-24 border bg-muted text-3xl font-semibold uppercase tracking-tight",
              "grayscale filter blur-sm opacity-70"
            )}
          >
            <AvatarFallback className="bg-transparent text-3xl font-semibold">
              ?
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Anonymous user
            </h1>
            <p className="text-sm text-muted-foreground">
              Details for this colleague will unlock once you are paired
              together.
            </p>
          </div>
          <EyeOff className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-3 rounded-lg border border-muted-foreground/30 bg-background/80 p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Profile preview</h2>
            <p className="text-sm text-muted-foreground">
              Even without a match you can discover what this person enjoys
              chatting about.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderMaskedField(
              "Hobbies",
              maskedHobbies,
              "This user has not listed hobbies yet."
            )}
            {renderMaskedField(
              "Interests",
              maskedInterests,
              "This user has not listed interests yet."
            )}
          </div>
        </div>
      </div>
    );
  }

  const profile: UserProfile = {
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
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
