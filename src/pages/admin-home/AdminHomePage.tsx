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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <header className="space-y-1">
        <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-foreground">
          <Home aria-hidden className="h-8 w-8 text-primary" />
          <span>Admin overview</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Get a snapshot of all organizations, users, and pairing controls.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              Organization directory
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Browse and drill into any organization to inspect owners, assets,
              and pairing readiness.
            </CardDescription>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/organization-list">Go to organizations</Link>
            </Button>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">User roster</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Review every user, resolve reports, and check onboarding status.
            </CardDescription>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/user-list">Go to users</Link>
            </Button>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">
              Pairing algorithms
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Quickly access cadence and rules per organization to keep matches
              healthy.
            </CardDescription>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/algorithm-settings">Manage algorithms</Link>
            </Button>
          </CardHeader>
        </Card>
        <Card className="bg-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-base font-medium">Statistics</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Monitor engagement and outcomes at the organization level.
            </CardDescription>
            <Button asChild variant="outline" className="w-fit">
              <Link to="/statistics">Open statistics</Link>
            </Button>
          </CardHeader>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Admin shortcuts
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="block transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
            >
              <Card className="flex h-full flex-col gap-4 bg-card p-5 transition hover:bg-muted/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
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
                <Button variant="ghost" className="justify-start px-0">
                  {link.cta}
                </Button>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;
