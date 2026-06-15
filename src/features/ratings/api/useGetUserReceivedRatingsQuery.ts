import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type ReceivedRating = {
  id: string;
  stars: number;
  feedback?: string | null;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  } | null;
  meetingEvent: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAId: string;
    userBId: string;
  };
};

export type UserReceivedRatingsResult = {
  userId: string;
  averageRating?: number | null;
  totalRatings: number;
  ratings: ReceivedRating[];
};

export type UserReceivedRatingsData = {
  getUserReceivedRatings: UserReceivedRatingsResult | null;
};

/**
 * React-query key factory for a user's received ratings. Previously the
 * GraphQL document `GET_USER_RECEIVED_RATINGS_QUERY`; kept exported under the
 * same name (now a key factory).
 */
export const GET_USER_RECEIVED_RATINGS_QUERY = (userId?: string) =>
  ["users", "received-ratings", userId ?? null] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/:id/received-ratings (org_admin / super_admin). Preserves the
 * Apollo return shape `{ data: { getUserReceivedRatings }, loading, error,
 * refetch }`.
 */
export const useGetUserReceivedRatingsQuery = (userId?: string) => {
  const query = useQuery({
    queryKey: GET_USER_RECEIVED_RATINGS_QUERY(userId),
    queryFn: () =>
      apiGet<UserReceivedRatingsResult | null>(
        `/users/${encodeURIComponent(userId ?? "")}/received-ratings`
      ),
    enabled: !!userId,
  });

  return {
    data:
      query.data !== undefined
        ? ({
            getUserReceivedRatings: query.data ?? null,
          } as UserReceivedRatingsData)
        : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
