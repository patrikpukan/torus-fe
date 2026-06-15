import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type TagObject = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

export type UserDetail = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  location?: string | null;
  position?: string | null;
  preferredActivity?: string | null;
  profileImageUrl?: string | null;
  profileStatus?: string | null;
  role?: string | null;
  isActive?: boolean | null;
  organizationId?: string | null;
  organization?: {
    id: string;
    name: string;
  } | null;
  departmentId?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
  hobbies?: TagObject[] | null;
  interests?: TagObject[] | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
};

export type UserByIdQueryData = {
  userById: UserDetail | null;
};

export type UserByIdQueryVariables = {
  id?: string;
};

/**
 * React-query key factory for a single user by id. Previously a GraphQL
 * document `USER_BY_ID_QUERY`; kept exported under the same name (now a key
 * factory) so consumers referencing it in Apollo `refetchQueries` still
 * import the identifier. Mutations invalidate `["users", "byId"]`.
 */
export const USER_BY_ID_QUERY = (variables?: { id?: string }) =>
  ["users", "byId", variables?.id ?? null] as const;

export const userByIdQueryKey = (id?: string) =>
  ["users", "byId", id ?? null] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/:id (any authed user; service authorizes). Preserves the
 * Apollo return shape `{ data: { userById }, loading, error, refetch }`.
 */
export const useUserByIdQuery = (id?: string) => {
  const query = useQuery({
    queryKey: userByIdQueryKey(id),
    queryFn: () =>
      apiGet<UserDetail | null>(`/users/${encodeURIComponent(id ?? "")}`),
    enabled: !!id,
  });

  return {
    data:
      query.data !== undefined
        ? ({ userById: query.data ?? null } as UserByIdQueryData)
        : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
