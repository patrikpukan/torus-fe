import OrganizationListItem from "@/features/organization/components/OrganizationListItem";
import { useOrganizationsQuery } from "@/features/organization/api/useOrganizationsQuery";

const OrganizationListPage = () => {
  const { data, loading, error } = useOrganizationsQuery();
  const organizations = data?.organizations ?? [];

  return (
    <div className="container py-4">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Organizations</h1>

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
          <div className="rounded border border-muted-foreground/20 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            No organizations found.
          </div>
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
