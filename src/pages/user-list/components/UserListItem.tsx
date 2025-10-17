import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

type UserListItemProps = {
  user: {
    email: string;
    name: string;
    surname: string;
    organization: string;
    pairingStatus: string;
    accountStatus: string;
  };
};

const UserListItem = ({ user }: UserListItemProps) => {
  return (
    <Link to={`/user-list/${encodeURIComponent(user.email)}`} className="block">
      <Card className="p-4 transition-colors cursor-pointer">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage alt={`${user.name} ${user.surname}`} />
                <AvatarFallback delayMs={0}>
                  {user.name?.[0]?.toUpperCase()}
                  {user.surname?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-base font-medium md:text-lg">
                {user.name} {user.surname}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {user.organization}
            </div>
          </div>

          <div className="flex gap-2 pt-1 sm:pt-0">
            <Badge
              variant={
                user.pairingStatus === "Paired"
                  ? "success"
                  : user.pairingStatus === "Seeking Pair"
                    ? "info"
                    : user.pairingStatus === "On Hold"
                      ? "warning"
                      : "muted"
              }
            >
              {user.pairingStatus}
            </Badge>
            <Badge
              variant={
                user.accountStatus === "Active"
                  ? "success"
                  : user.accountStatus === "Inactive"
                    ? "muted"
                    : user.accountStatus === "Suspended"
                      ? "destructive"
                      : "info"
              }
            >
              {user.accountStatus}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default UserListItem;
