import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { UsersQueryItem } from "@/features/users/api/useUsersQuery";
import { Link } from "react-router-dom";

type UserListItemProps = {
  user: UsersQueryItem;
};

const UserListItem = ({ user }: UserListItemProps) => {
  const computedName = [user.firstName, user.lastName]
    .filter((part) => part && part.trim().length > 0)
    .join(" ")
    .trim();

  const displayName = computedName || user.username || user.email;

  return (
    <Link to={`/user-list/${encodeURIComponent(user.id)}`} className="block">
      <Card className="cursor-pointer p-4 transition-colors">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage alt={displayName} />
                <AvatarFallback delayMs={0}>
                  {displayName?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-base font-medium md:text-lg">{displayName}</div>
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <div className="flex gap-2 pt-1 sm:pt-0">
            {user.role && (
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            )}
            {user.profileStatus && (
              <Badge variant="secondary" className="capitalize">
                {user.profileStatus}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default UserListItem;
