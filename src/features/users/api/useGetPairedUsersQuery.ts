import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";
import type { UsersQueryItem } from "./useUsersQuery";

export type GetPairedUsersData = {
  getPairedUsers: UsersQueryItem[];
};

/**
 * React-query key for the current user's paired users. Previously the GraphQL
 * document `GET_PAIRED_USERS_QUERY`; kept exported under the same name (now a
 * key) so ReportUserDialog's `refetchQueries` reference still imports it. The
 * report mutation invalidates this key internally.
 */
export const GET_PAIRED_USERS_QUERY = ["users", "paired"] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/paired. Preserves the Apollo return shape
 * `{ data: { getPairedUsers }, loading, error, refetch }`.
 */
export const useGetPairedUsersQuery = () => {
  const query = useQuery({
    queryKey: GET_PAIRED_USERS_QUERY,
    queryFn: () => apiGet<UsersQueryItem[]>("/users/paired"),
  });

  return {
    data: query.data
      ? ({ getPairedUsers: query.data } as GetPairedUsersData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
