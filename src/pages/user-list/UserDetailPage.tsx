import { useParams } from "react-router-dom";

import ProfileForm from "@/features/profile/ProfileForm";
import SendResetPasswordButton from "@/features/auth/components/SendResetPasswordButton";
import { useUserByIdQuery } from "@/features/users/api/useUserByIdQuery";
import type { UserProfile } from "@/types/User";
import { useAuth } from "@/hooks/useAuth";

const UserDetailPage = () => {
  const { appRole } = useAuth();
  const params = useParams();
  const userId = params.id ?? "";

  const { data, loading, error } = useUserByIdQuery(
    userId ? decodeURIComponent(userId) : undefined
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Loading user...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Unable to load user
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const user = data?.userById;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          User not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find a user for that link.
        </p>
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
      {appRole === "org_admin" && (
        <div className="mt-6 flex justify-center">
          <SendResetPasswordButton email={user.email} variant="outline" />
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
