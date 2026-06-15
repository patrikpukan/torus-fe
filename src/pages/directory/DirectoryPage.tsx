import { Users2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import {
  useOrganizationColleagues,
  type ColleagueTag,
  type OrganizationColleague,
} from "@/features/directory/api/useOrganizationColleagues";
import { normalizeAssetUrl } from "@/lib/assetUrl";
import { cn } from "@/lib/utils";

const fullName = (c: OrganizationColleague): string =>
  [c.firstName, c.lastName].filter(Boolean).join(" ").trim();

const initials = (c: OrganizationColleague): string => {
  const first = c.firstName?.trim()?.[0] ?? "";
  const last = c.lastName?.trim()?.[0] ?? "";
  const combined = `${first}${last}`.toUpperCase();
  return combined || "?";
};

const roleLabel: Record<string, string> = {
  user: "Member",
  org_admin: "Admin",
  super_admin: "Super admin",
};

const ColleagueSkeleton = () => (
  <Card className="border-0 p-5 shadow-elevated">
    <div className="flex items-center gap-4">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </Card>
);

type ColleagueCardProps = {
  colleague: OrganizationColleague;
  sharedTagIds: Set<string>;
};

const ColleagueCard = ({ colleague, sharedTagIds }: ColleagueCardProps) => {
  const name = fullName(colleague) || "Unnamed colleague";
  const tags: ColleagueTag[] = [...colleague.interests, ...colleague.hobbies];
  const subtitle = [colleague.position, roleLabel[colleague.role] ?? colleague.role]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="flex h-full flex-col border-0 p-5 shadow-elevated">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage
            src={normalizeAssetUrl(colleague.profileImageUrl) || undefined}
            alt=""
          />
          <AvatarFallback>{initials(colleague)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-heading text-base font-semibold text-foreground">
            {name}
          </p>
          {subtitle && (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
          {colleague.departmentName && (
            <p className="truncate text-xs text-muted-foreground">
              {colleague.departmentName}
            </p>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 8).map((tag) => {
            const isShared = sharedTagIds.has(tag.id);
            return (
              <Badge
                key={tag.id}
                variant={isShared ? "default" : "secondary"}
                className={cn(isShared && "ring-1 ring-primary/30")}
              >
                {tag.name}
                {isShared ? " ✓" : ""}
              </Badge>
            );
          })}
        </div>
      )}
    </Card>
  );
};

const DirectoryPage = () => {
  const { data, loading } = useOrganizationColleagues();
  const { data: currentUserData } = useGetCurrentUserQuery();

  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState<string | null>(null);

  const colleagues = useMemo(
    () => data?.organizationColleagues ?? [],
    [data]
  );

  // Tag ids the current user shares — used to highlight overlap on each card.
  const myTagIds = useMemo(() => {
    const user = currentUserData?.getCurrentUser;
    const ids = new Set<string>();
    for (const t of user?.hobbies ?? []) ids.add(t.id);
    for (const t of user?.interests ?? []) ids.add(t.id);
    return ids;
  }, [currentUserData]);

  // Distinct interests across the org, for the filter chips.
  const allInterests = useMemo(() => {
    const byName = new Map<string, string>();
    for (const c of colleagues) {
      for (const tag of c.interests) {
        if (!byName.has(tag.name)) byName.set(tag.name, tag.name);
      }
    }
    return Array.from(byName.values()).sort((a, b) => a.localeCompare(b));
  }, [colleagues]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return colleagues.filter((c) => {
      const matchesName =
        !term || fullName(c).toLowerCase().includes(term);
      const matchesInterest =
        !interestFilter ||
        c.interests.some((t) => t.name === interestFilter);
      return matchesName && matchesInterest;
    });
  }, [colleagues, search, interestFilter]);

  return (
    <div className="space-y-6 px-1 pb-10">
      <PageHeader
        icon={Users2}
        title="Directory"
        description="Discover colleagues across your organization."
      />

      <Card className="border-0 p-5 shadow-elevated">
        <div className="space-y-4">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            aria-label="Search colleagues by name"
          />
          {allInterests.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by interest"
            >
              <button
                type="button"
                onClick={() => setInterestFilter(null)}
                aria-pressed={interestFilter === null}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  interestFilter === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                All
              </button>
              {allInterests.map((interest) => {
                const active = interestFilter === interest;
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() =>
                      setInterestFilter(active ? null : interest)
                    }
                    aria-pressed={active}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {loading && colleagues.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ColleagueSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-elevated">
          <EmptyState
            icon={Users2}
            title="No colleagues found"
            description={
              colleagues.length === 0
                ? "There's no one to show in your directory yet."
                : "Try a different name or interest filter."
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((colleague) => (
            <ColleagueCard
              key={colleague.id}
              colleague={colleague}
              sharedTagIds={myTagIds}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
