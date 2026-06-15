import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type MyEngagementStats = {
  currentStreak: number;
  meetingsCompleted: number;
  colleaguesConnected: number;
};

export type MyEngagementStatsQueryData = {
  myEngagementStats: MyEngagementStats;
};

/**
 * React-query key for the current user's engagement stats. Previously the
 * GraphQL document `MY_ENGAGEMENT_STATS_QUERY`; kept exported under the same
 * name (now a key).
 */
export const MY_ENGAGEMENT_STATS_QUERY = ["users", "me", "engagement-stats"] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/users/me/engagement-stats. Preserves the Apollo return shape
 * `{ data: { myEngagementStats }, loading, error, refetch }`.
 */
export const useMyEngagementStats = () => {
  const query = useQuery({
    queryKey: MY_ENGAGEMENT_STATS_QUERY,
    queryFn: () => apiGet<MyEngagementStats>("/users/me/engagement-stats"),
  });

  return {
    data: query.data
      ? ({ myEngagementStats: query.data } as MyEngagementStatsQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
