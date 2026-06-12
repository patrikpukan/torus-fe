import { useAuth } from "@/hooks/useAuth";

import AdminReportsPage from "./AdminReportsPage";
import { ReportsView } from "./ReportsView";

const ReportsPage = () => {
  const { appRole, loading: authLoading, organizationId } = useAuth();

  if (authLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (appRole === "super_admin") {
    return <AdminReportsPage />;
  }

  if (appRole === "org_admin") {
    return <ReportsView organizationId={organizationId} />;
  }

  return (
    <div className="container py-8">
      <div className="rounded-lg bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          You do not have permission to access this page
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
