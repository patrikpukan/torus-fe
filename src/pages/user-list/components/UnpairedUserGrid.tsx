import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AnonUsersQueryItem } from "@/features/users/api/useAnonUsersQuery";

type UnpairedUserGridProps = {
  users: AnonUsersQueryItem[];
};

const UnpairedUserGrid = ({ users }: UnpairedUserGridProps) => {
  if (!users.length) {
    return null;
  }

  return (
    <section className="space-y-4 pt-6">
      <div>
        <h2 className="text-xl font-semibold">Discover new people</h2>
        <p className="text-sm text-muted-foreground">
          Profiles you have not been paired with yet.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const displayName =
            [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
            user.email ||
            "User";

          return (
            <Card
              key={user.id}
              className="border-muted-foreground/20 transition hover:border-primary/50"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Link
                  to={`/user-list/${encodeURIComponent(user.id)}`}
                  className="flex flex-1 items-center gap-4"
                  aria-label={`View profile for ${displayName}`}
                >
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage
                      alt={displayName}
                      src={user.profileImageUrl ?? undefined}
                    />
                    <AvatarFallback
                      delayMs={0}
                      className="text-lg font-semibold"
                    >
                      {displayName?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold sm:text-base">
                      {displayName}
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {user.email ?? ""}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default UnpairedUserGrid;
