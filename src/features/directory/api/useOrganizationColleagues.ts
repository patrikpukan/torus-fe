import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type ColleagueTag = {
  id: string;
  name: string;
  category: string;
};

export type OrganizationColleague = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  position: string | null;
  profileImageUrl: string | null;
  departmentName: string | null;
  hobbies: ColleagueTag[];
  interests: ColleagueTag[];
};

export type OrganizationColleaguesQueryData = {
  organizationColleagues: OrganizationColleague[];
};

/**
 * React-query key for the organization directory. Previously the GraphQL
 * document `ORGANIZATION_COLLEAGUES_QUERY`; kept exported under the same name
 * (now a key).
 */
export const ORGANIZATION_COLLEAGUES_QUERY = ["users", "colleagues"] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/colleagues. Each colleague includes hobbies/interests +
 * departmentName (produced by the service). Preserves the Apollo return shape
 * `{ data: { organizationColleagues }, loading, error, refetch }`.
 */
export const useOrganizationColleagues = () => {
  const query = useQuery({
    queryKey: ORGANIZATION_COLLEAGUES_QUERY,
    queryFn: () => apiGet<OrganizationColleague[]>("/users/colleagues"),
  });

  return {
    data: query.data
      ? ({
          organizationColleagues: query.data,
        } as OrganizationColleaguesQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
