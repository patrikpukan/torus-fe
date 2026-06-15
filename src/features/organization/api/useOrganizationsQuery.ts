import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type OrganizationQueryItem = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationsQueryData = {
  organizations: OrganizationQueryItem[];
};

export const organizationsQueryKey = ["organizations", "list"];

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/organizations (super_admin only). Preserves the Apollo return shape
 * `{ data: { organizations }, loading, error }` so OrganizationListPage,
 * AdminAlgorithmSettingsPage, AdminStatisticsPage, AdminReportsPage and
 * AdminUserListPage keep working unchanged.
 */
export const useOrganizationsQuery = () => {
  const query = useQuery({
    queryKey: organizationsQueryKey,
    queryFn: () => apiGet<OrganizationQueryItem[]>("/organizations"),
  });

  return {
    ...query,
    data: query.data ? { organizations: query.data } : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
  };
};
