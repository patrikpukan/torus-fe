import { useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";

import { useUserByIdQuery } from "@/features/users/api/useUserByIdQuery";
import { cn } from "@/lib/utils";

const UserDetailPage = () => {
  const params = useParams();
  const userId = params.id ?? "";

  const { data, loading, error } = useUserByIdQuery(
    userId ? decodeURIComponent(userId) : undefined,
  );

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Loading user…</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
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
      <div className="container py-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          User not found
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          We couldn't find a user for that link.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        {[user.firstName, user.lastName]
          .filter((part) => part && part.trim().length > 0)
          .join(" ")
          .trim() || user.username || user.email}
      </h1>
      <Card className="p-6 mt-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Email</div>
          <div className="text-base">{user.email}</div>

          <div className="text-sm text-muted-foreground mt-4">
            Profile Status
          </div>
          <div
            className={cn(
              "inline-flex items-center rounded border px-2 py-1 text-xs font-medium capitalize",
              "border-muted-foreground/20 bg-muted",
            )}
          >
            {user.profileStatus ?? "unknown"}
          </div>

          <div className="text-sm text-muted-foreground mt-4">Role</div>
          <div className="text-base capitalize">{user.role ?? "user"}</div>
        </div>
      </Card>
    </div>
  );
};

export default UserDetailPage;
