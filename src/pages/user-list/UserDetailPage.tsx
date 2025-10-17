import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";

import { userList } from "../../mocks/userList";
import type { UserProfile } from "../../types/User";

const UserDetailPage = () => {
  const params = useParams();
  const emailParam = params.email ?? "";

  const user: UserProfile | undefined = useMemo(() => {
    const decodedEmail = decodeURIComponent(emailParam);
    return userList.find((u: UserProfile) => u.email === decodedEmail);
  }, [emailParam]);

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
        {user.name} {user.surname}
      </h1>
      <Card className="p-6 mt-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Email</div>
          <div className="text-base">{user.email}</div>

          <div className="text-sm text-muted-foreground mt-4">Organization</div>
          <div className="text-base">{user.organization}</div>

          <div className="text-sm text-muted-foreground mt-4">
            Pairing Status
          </div>
          <div className="text-base">{user.pairingStatus}</div>
        </div>
      </Card>
    </div>
  );
};

export default UserDetailPage;
