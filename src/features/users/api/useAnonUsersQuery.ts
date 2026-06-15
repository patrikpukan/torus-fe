import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";
import type { UsersQueryItem } from "./useUsersQuery";

export type AnonUsersQueryItem = UsersQueryItem;

export type AnonUsersQueryData = {
  anonUsers: AnonUsersQueryItem[];
};

/**
 * React-query key for the anonymous-user pool. Previously the GraphQL document
 * `ANON_USERS_QUERY`; kept exported under the same name (now a key) for any
 * `refetchQueries` references.
 */
export const ANON_USERS_QUERY = ["users", "anon"] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/anon (role `user` only). Preserves the Apollo return shape
 * `{ data: { anonUsers }, loading, error, refetch }`.
 */
export const useAnonUsersQuery = () => {
  const query = useQuery({
    queryKey: ANON_USERS_QUERY,
    queryFn: () => apiGet<AnonUsersQueryItem[]>("/users/anon"),
  });

  return {
    data: query.data
      ? ({ anonUsers: query.data } as AnonUsersQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
