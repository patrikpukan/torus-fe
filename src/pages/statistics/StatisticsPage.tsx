import { useAuth } from "@/hooks/useAuth";

import AdminStatisticsPage from "./AdminStatisticsPage";
import { StatisticsView } from "./StatisticsView";

const StatisticsPage = () => {
  const { appRole, loading: authLoading, organizationId } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (appRole === "super_admin") {
    return <AdminStatisticsPage />;
  }

  if (appRole === "org_admin") {
    return <StatisticsView organizationId={organizationId} />;
  }

  return (
    <div className="container py-8">
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">
          You do not have permission to access this page
        </p>
      </div>
    </div>
  );
};

export default StatisticsPage;
