import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type OrganizationByIdQueryItem = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  departments?: unknown[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationByIdQueryData = {
  organizationById: OrganizationByIdQueryItem | null;
};

export const organizationByIdQueryKey = (id: string) => [
  "organizations",
  "by-id",
  id,
];

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/organizations/:id (any authed user + assertSameOrg). The REST
 * response includes a `departments` array (reproducing the GraphQL
 * @ResolveField). Preserves the Apollo return shape
 * `{ data: { organizationById }, loading, error }` so OrganizationDetailPage
 * keeps working unchanged.
 */
export const useOrganizationByIdQuery = (id?: string) => {
  const query = useQuery({
    queryKey: organizationByIdQueryKey(id ?? ""),
    queryFn: () =>
      apiGet<OrganizationByIdQueryItem | null>(
        `/organizations/${encodeURIComponent(id ?? "")}`
      ),
    enabled: Boolean(id),
  });

  return {
    ...query,
    data: query.data !== undefined
      ? { organizationById: query.data ?? null }
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
  };
};
