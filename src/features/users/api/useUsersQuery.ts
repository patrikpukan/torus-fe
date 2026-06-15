import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type UsersQueryItem = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  profileImageUrl?: string | null;
  profileStatus?: string | null;
  role?: string | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
};

export type UsersQueryData = {
  users: UsersQueryItem[];
};

/**
 * React-query key for the users list. Previously a GraphQL document under the
 * same name; kept exported so consumers (BanUserDialog, UnbanUserButton) that
 * referenced it in Apollo `refetchQueries` still import the identifier. The
 * mutations now invalidate this key internally.
 */
export const USERS_QUERY = ["users", "list"] as const;

export const usersQueryKey = (organizationId?: string) =>
  [...USERS_QUERY, { organizationId: organizationId ?? null }] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users?organizationId= (org_admin / super_admin only). Preserves the
 * Apollo return shape `{ data: { users }, loading, error, refetch }`.
 */
export const useUsersQuery = (organizationId?: string) => {
  const query = useQuery({
    queryKey: usersQueryKey(organizationId),
    queryFn: () =>
      apiGet<UsersQueryItem[]>(
        "/users",
        organizationId ? { organizationId } : undefined
      ),
  });

  return {
    data: query.data ? ({ users: query.data } as UsersQueryData) : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
