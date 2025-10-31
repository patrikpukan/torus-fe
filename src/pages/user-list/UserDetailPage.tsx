import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { EyeOff, Home } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfileForm from "@/features/profile/ProfileForm";
import SendResetPasswordButton from "@/features/auth/components/SendResetPasswordButton";
import { useUserByIdQuery } from "@/features/users/api/useUserByIdQuery";
import { useGetPairedUsersQuery } from "@/features/users/api/useGetPairedUsersQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import type { UserProfile } from "@/types/User";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const UserDetailPage = () => {
  const { appRole } = useAuth();
  const params = useParams();
  const location = useLocation();

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

    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Unable to load user
        </h1>
        {message && (
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
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
    return (
      <div className="mx-auto max-w-3xl py-12">
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
      </div>
    );
  }

  const profile: UserProfile = {
    email: user.email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    pairingStatus: user.profileStatus ?? undefined,
  };

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ProfileForm value={profile} />
      {isAdmin && (
        <div className="mt-6 flex justify-center">
          <SendResetPasswordButton email={user.email} variant="outline" />
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
