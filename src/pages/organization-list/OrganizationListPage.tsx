import OrganizationListItem from "@/features/organization/components/OrganizationListItem";
import { useOrganizationsQuery } from "@/features/organization/api/useOrganizationsQuery";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

const OrganizationListPage = () => {
  const { data, loading, error } = useOrganizationsQuery();
  const organizations = data?.organizations ?? [];

  return (
    <div className="container py-4">
      <div className="space-y-3">
        <PageHeader icon={Building2} title="Organizations" />

        {loading && (
          <div className="rounded border border-muted-foreground/20 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Loading organizations…
          </div>
        )}

        {error && (
          <div className="rounded border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Failed to load organizations: {error.message}
          </div>
        )}

        {!loading && !error && organizations.length === 0 && (
          <Card className="border-0">
            <EmptyState
              icon={Building2}
              title="No organizations yet"
              description="Organizations you create will appear here."
            />
          </Card>
        )}

        <div className="space-y-2">
          {organizations.map((organization) => (
            <OrganizationListItem
              key={organization.id}
              organization={organization}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationListPage;
