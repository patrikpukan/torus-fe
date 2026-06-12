import { useMemo } from "react";
import {
  AlertCircle,
  BarChart3,
  Home,
  Info,
  Settings2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import { useStatisticsQuery } from "@/features/statistics/api/useStatisticsQuery";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/features/pairings/components/dateUtils.ts";
import { useActivePairingPeriodQuery } from "@/features/pairings/api/useActivePairingPeriodQuery";

const MaintainerSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80" />
    </div>
    <Skeleton className="h-36 w-full" />
    <div className="grid gap-3 md:grid-cols-2">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
      <Skeleton className="h-28" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-6 w-32" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  </div>
);

const MaintainerHomePage = () => {
  const { appRole } = useAuth();
  const { data: currentUserData, loading: currentUserLoading } =
    useGetCurrentUserQuery();
  const maintainer = currentUserData?.getCurrentUser;
  const organization = maintainer?.organization;
  const organizationId = maintainer?.organizationId ?? organization?.id;

  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, []);

  const statsFilter = useMemo(() => {
    if (!organizationId) {
      return undefined;
    }

    return {
      organizationId,
      startDate: thirtyDaysAgo.toISOString(),
      endDate: new Date().toISOString(),
    };
  }, [organizationId, thirtyDaysAgo]);

  const { data: statsData, loading: statsLoading } =
    useStatisticsQuery(statsFilter);
  const statistics = statsData?.statistics;

  const { data: activePeriodData } = useActivePairingPeriodQuery();
  const activePeriodStart =
    activePeriodData?.activePairingPeriod?.startDate ?? null;

  const newUsersCount = statistics?.newUsersCount ?? 0;
  const reportsCount = statistics?.reportsCount ?? 0;
  const inactiveUsersCount = statistics?.inactiveUsersCount ?? 0;
  const matchedPairs =
    statistics?.pairingsByStatus?.find(
      (entry) => entry?.status?.toLowerCase() === "matched"
    )?.count ?? 0;

  const rollingWindowNote = "Data aggregated over the past 30 days.";

  const orgLink =
    appRole === "org_admin"
      ? "/my-org"
      : organization?.id
        ? `/org-detail/${encodeURIComponent(organization.id)}`
        : "/organization-list";

  const quickActions = [
    {
      title: "Manage users",
      description: "Review members, bans and invitations.",
      to: "/user-list",
      icon: <Users className="h-6 w-6" />,
      meta: `New users (30d): ${newUsersCount}`,
    },
    /*   {
      title: "Pairings overview",
      description: "Inspect current and historical matches.",
      to: "/pairings",
      icon: <Handshake className="h-6 w-6" />,
      meta: `Active matches: ${matchedPairs}`,
    },*/
    {
      title: "Reports",
      description: "Track escalations and follow-ups.",
      to: "/reports",
      icon: <AlertCircle className="h-6 w-6" />,
      meta: `New reports (30d): ${reportsCount}`,
    },
    {
      title: "Statistics",
      description: "Dive into performance insights.",
      to: "/statistics",
      icon: <BarChart3 className="h-6 w-6" />,
      meta: `Inactive members: ${inactiveUsersCount}`,
    },
    {
      title: "Algorithm settings",
      description: "Tune pairing preferences & cadence.",
      to: "/algorithm-settings",
      icon: <Settings2 className="h-6 w-6" />,
    },
  ];

  if (currentUserLoading && !maintainer) {
    return <MaintainerSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Home}
        title={
          maintainer?.firstName
            ? `Welcome back, ${maintainer.firstName}`
            : "Maintainer overview"
        }
        description="Stay on top of your organization, pairings and reported activity."
      />

      {/* Command-center layout: primary column + persistent right rail */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(290px,30%,360px)]">
        {/* Main column */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-elevated-lg">
            <div className="h-1.5 w-full gradient-primary" />
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                  <AvatarImage
                    alt={organization?.name ?? "Organization"}
                    src={organization?.imageUrl ?? undefined}
                  />
                  <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                    {organization?.name?.[0]?.toUpperCase() ?? "O"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    You are managing
                  </span>
                  <h2 className="font-heading text-2xl font-bold leading-tight">
                    {organization?.name ?? "Unknown organization"}
                  </h2>
                  {organization?.code && (
                    <span className="text-sm text-muted-foreground">
                      Org code: {organization.code}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <Button asChild>
                  <Link to={orgLink}>View organization</Link>
                </Button>
                <span className="text-xs text-muted-foreground">
                  Change assets or admins
                </span>
              </div>
            </div>
          </Card>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Quick actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full flex-col gap-4 border-0 p-5 shadow-elevated transition group-hover:shadow-elevated-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {action.description}
                      </CardDescription>
                    </div>
                    {action.meta && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {action.meta}
                      </p>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <Card className="border-0 p-5 shadow-elevated">
            <CardTitle className="mb-4 text-sm font-medium text-muted-foreground">
              This cycle
            </CardTitle>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Running since
                </span>
                <span className="text-base font-semibold">
                  {formatDate(activePeriodStart) || "—"}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">
                  Active matches
                </span>
                <span className="text-2xl font-bold tabular-nums">
                  {statsLoading ? "…" : matchedPairs}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-0 p-5 shadow-elevated">
            <div className="mb-4 flex items-center gap-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last 30 days
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">{rollingWindowNote}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">New users</span>
                <span className="text-2xl font-bold tabular-nums">
                  {statsLoading ? "…" : newUsersCount}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">Reports</span>
                <span className="text-2xl font-bold tabular-nums">
                  {statsLoading ? "…" : reportsCount}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
                <span className="text-sm text-muted-foreground">
                  Inactive members
                </span>
                <span className="text-2xl font-bold tabular-nums">
                  {statsLoading ? "…" : inactiveUsersCount}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Encourage inactive members to finish onboarding to keep the pool
              fresh.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default MaintainerHomePage;
