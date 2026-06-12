import { useMemo } from "react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Home,
  Settings2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useStatisticsQuery } from "@/features/statistics/api/useStatisticsQuery";

const AdminHomePage = () => {
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }, []);

  const statsFilter = useMemo(
    () => ({
      startDate: thirtyDaysAgo.toISOString(),
      endDate: new Date().toISOString(),
    }),
    [thirtyDaysAgo]
  );

  const { data: statsData, loading: statsLoading } =
    useStatisticsQuery(statsFilter);
  const statistics = statsData?.statistics;

  const newUsersCount = statistics?.newUsersCount ?? 0;
  const reportsCount = statistics?.reportsCount ?? 0;
  const inactiveUsersCount = statistics?.inactiveUsersCount ?? 0;

  const quickLinks = [
    {
      title: "Organizations",
      description: "Review all organizations, assets, and owners.",
      to: "/organization-list",
      icon: <Building2 className="h-6 w-6" />,
      cta: "View organizations",
    },
    {
      title: "Users",
      description: "Browse every user across organizations.",
      to: "/user-list",
      icon: <Users className="h-6 w-6" />,
      cta: "Manage users",
      meta: statsLoading ? "Loading..." : `New users (30d): ${newUsersCount}`,
    },
    {
      title: "Reports",
      description: "Track escalations across all organizations.",
      to: "/reports",
      icon: <AlertCircle className="h-6 w-6" />,
      cta: "Review reports",
      meta: statsLoading ? "Loading..." : `New reports (30d): ${reportsCount}`,
    },
    {
      title: "Algorithm settings",
      description: "Jump to pairing cadence and preferences per org.",
      to: "/algorithm-settings",
      icon: <Settings2 className="h-6 w-6" />,
      cta: "Tune algorithms",
    },
    {
      title: "Statistics",
      description: "Inspect performance and health per organization.",
      to: "/statistics",
      icon: <BarChart3 className="h-6 w-6" />,
      cta: "View stats",
      meta: statsLoading
        ? "Loading..."
        : `Inactive users: ${inactiveUsersCount}`,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Home}
        title="Admin overview"
        description="Get a snapshot of all organizations, users, and pairing controls."
      />

      {/* Command-center layout: shortcut tiles + stats rail */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_clamp(290px,30%,360px)]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Admin shortcuts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.to}
                className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Card className="flex h-full flex-col gap-4 border-0 p-5 shadow-elevated transition group-hover:shadow-elevated-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {link.icon}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {link.description}
                    </CardDescription>
                  </div>
                  {link.meta && (
                    <p className="text-xs font-medium text-muted-foreground">
                      {link.meta}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Right rail */}
        <aside className="space-y-4">
          <Card className="border-0 p-5 shadow-elevated">
            <CardTitle className="mb-4 text-sm font-medium text-muted-foreground">
              Last 30 days, all organizations
            </CardTitle>
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
                  Inactive users
                </span>
                <span className="text-2xl font-bold tabular-nums">
                  {statsLoading ? "…" : inactiveUsersCount}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-0 p-5 shadow-elevated">
            <CardTitle className="mb-3 text-sm font-medium text-muted-foreground">
              Need a new organization?
            </CardTitle>
            <CardDescription className="mb-4 text-sm">
              Register an organization and assign its first admin.
            </CardDescription>
            <Button asChild className="w-full">
              <Link to="/register-org">Register organization</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default AdminHomePage;
