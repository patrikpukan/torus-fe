import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

interface UserAchievementPoints {
  earnedPoints: number;
  possiblePoints: number;
  completionPercentage: number;
}

/**
 * Hook to fetch user's total achievement points and completion percentage
 * @param userId - Optional user ID. If not provided, uses current user
 * @returns Query result with earnedPoints, possiblePoints, completionPercentage
 */
export function useUserAchievementPoints(userId?: string) {
  return useQuery({
    queryKey: ["userAchievementPoints", userId],
    queryFn: () =>
      apiGet<UserAchievementPoints>("/achievements/points", {
        userId: userId || undefined,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
