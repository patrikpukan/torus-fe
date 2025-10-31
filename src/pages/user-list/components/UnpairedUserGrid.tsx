import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UsersQueryItem } from "@/features/users/api/useUsersQuery";

type UnpairedUserGridProps = {
  users: UsersQueryItem[];
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
          Profiles you have not been paired with yet. Identities stay hidden
          until a match happens.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user.id}
            className="border-muted-foreground/20 transition hover:border-primary/50"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <Link
                to={`/user-list/${encodeURIComponent(user.id)}?mode=incognito`}
                className="flex flex-1 items-center gap-4"
                aria-label="View anonymous profile"
              >
                <Avatar className="h-12 w-12 border bg-muted text-muted-foreground">
                  <AvatarImage alt="Anonymous user" className="hidden" />
                  <AvatarFallback delayMs={0} className="text-lg font-semibold">
                    ?
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold sm:text-base">
                    Anonymous user
                  </span>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    Details available after pairing
                  </span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default UnpairedUserGrid;
