import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type MyOrganizationQueryItem = {
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

export type MyOrganizationQueryData = {
  myOrganization: MyOrganizationQueryItem | null;
};

export const myOrganizationQueryKey = ["organizations", "mine"];

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/organizations/mine (any authed user). The REST response includes a
 * `departments` array (reproducing the GraphQL @ResolveField). Preserves the
 * Apollo return shape `{ data: { myOrganization }, loading, error }` so
 * OrganizationDetailPage keeps working unchanged.
 */
export const useMyOrganizationQuery = () => {
  const query = useQuery({
    queryKey: myOrganizationQueryKey,
    queryFn: () =>
      apiGet<MyOrganizationQueryItem | null>("/organizations/mine"),
  });

  return {
    ...query,
    data: query.data !== undefined
      ? { myOrganization: query.data ?? null }
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
  };
};
