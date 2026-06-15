import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type CurrentUserTag = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

/**
 * Shape of the current user returned by GET /api/users/me. Mirrors the fields
 * the old `GetCurrentUser` GraphQL query selected (including the inlined field
 * resolvers: hobbies, interests, organization, department).
 */
export type CurrentUserData = {
  id: string;
  email: string;
  organizationId: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  location?: string | null;
  position?: string | null;
  hobbies?: CurrentUserTag[] | null;
  interests?: CurrentUserTag[] | null;
  profileImageUrl?: string | null;
  profileStatus?: string | null;
  isActive?: boolean | null;
  idealColleagueUsesRemaining?: number | null;
  preferredActivity?: string | null;
  suspendedUntil?: string | null;
  departmentId?: string | null;
  hiddenFromDirectory?: boolean | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
  organization?: {
    id: string;
    name: string;
    code: string;
    imageUrl?: string | null;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
};

export type GetCurrentUserData = {
  getCurrentUser: CurrentUserData | null;
};

/**
 * Query key for the current user. Previously a GraphQL document also named
 * `GET_CURRENT_USER`; kept under the same export name so other modules that
 * referenced it in Apollo `refetchQueries` (e.g. HomePage, profile updates)
 * continue to import it. Now used as a react-query key to invalidate.
 */
export const GET_CURRENT_USER = ["users", "me"] as const;

/**
 * Apollo-style error shape preserved for AuthProvider, which inspects both
 * `.graphQLErrors` and `.message` to detect a ban/suspension. REST errors are
 * plain `Error`s with the response body as the message, so `graphQLErrors`
 * stays empty and the `.message` check carries the ban detection.
 */
type CurrentUserError = Error & {
  graphQLErrors: Array<{
    message?: string | null;
    extensions?: { code?: string; [key: string]: unknown };
  }>;
};

const toCurrentUserError = (error: unknown): CurrentUserError | undefined => {
  if (!error) {
    return undefined;
  }
  const base = error instanceof Error ? error : new Error(String(error));
  return Object.assign(base, { graphQLErrors: [] }) as CurrentUserError;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/me. Preserves the Apollo return shape consumers (AuthProvider,
 * ProfileView, ProfileEditPage, UserDetailPage, PairedUsersView) rely on:
 * `{ data: { getCurrentUser }, loading, refetch, error }`. `error` exposes a
 * `graphQLErrors` array so AuthProvider's ban-detection compiles unchanged.
 */
export const useGetCurrentUserQuery = (options?: { skip?: boolean }) => {
  const query = useQuery({
    queryKey: GET_CURRENT_USER,
    queryFn: () => apiGet<CurrentUserData | null>("/users/me"),
    enabled: !options?.skip,
  });

  return {
    ...query,
    data:
      query.data !== undefined
        ? ({ getCurrentUser: query.data ?? null } as GetCurrentUserData)
        : undefined,
    loading: query.isLoading,
    refetch: query.refetch,
    error: toCurrentUserError(query.error),
  };
};
