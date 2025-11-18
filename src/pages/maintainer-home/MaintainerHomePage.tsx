import { useMemo } from "react";
import {
  AlertCircle,
  BarChart3,
  Handshake,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    {
      title: "Pairings overview",
      description: "Inspect current and historical matches.",
      to: "/pairings",
      icon: <Handshake className="h-6 w-6" />,
      meta: `Active matches: ${matchedPairs}`,
    },
    {
      title: "Algorithm settings",
      description: "Tune pairing preferences & cadence.",
      to: "/algorithm-settings",
      icon: <Settings2 className="h-6 w-6" />,
    },
    {
      title: "Statistics",
      description: "Dive into performance insights.",
      to: "/statistics",
      icon: <BarChart3 className="h-6 w-6" />,
      meta: `Inactive members: ${inactiveUsersCount}`,
    },
    {
      title: "Reports",
      description: "Track escalations and follow-ups.",
      to: "/reports",
      icon: <AlertCircle className="h-6 w-6" />,
      meta: `New reports (30d): ${reportsCount}`,
    },
  ];

  if (currentUserLoading && !maintainer) {
    return <MaintainerSkeleton />;
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {maintainer?.firstName
            ? `Welcome back, ${maintainer.firstName}`
            : "Maintainer overview"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Stay on top of your organization, pairings and reported activity.
        </p>
      </header>

      <section>
        <Card className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between bg-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage
                alt={organization?.name ?? "Organization"}
                src={organization?.imageUrl ?? undefined}
              />
              <AvatarFallback className="bg-muted text-2xl font-semibold">
                {organization?.name?.[0]?.toUpperCase() ?? "O"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">You are managing</p>
              <h2 className="text-2xl font-semibold leading-tight">
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
            <CardDescription>
              Jump into the organization detail to change assets or admins.
            </CardDescription>
            <Button asChild variant="outline">
              <Link to={orgLink}>View organization</Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              A new pairing cycle has been running since
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground">
              {formatDate(activePeriodStart) || "—"}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              Currently inactive members
            </CardTitle>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {statsLoading ? "…" : inactiveUsersCount}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Encourage them to finish onboarding to keep the pool fresh.
            </p>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                New users
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {rollingWindowNote}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {statsLoading ? "…" : newUsersCount}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Invitations accepted within the last month.
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Reports
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {rollingWindowNote}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {statsLoading ? "…" : reportsCount}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Escalations that need your attention.
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Active matches
              </CardTitle>
            </div>
            <CardDescription className="text-3xl font-semibold text-foreground">
              {statsLoading ? "…" : matchedPairs}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Keep an eye on the matchmaking health for this cycle.
            </p>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="block transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
            >
              <Card className="flex h-full flex-col gap-4 p-5 transition bg-card hover:bg-muted/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
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
  );
};

export default MaintainerHomePage;
