import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { apolloClient } from "../../../lib/apolloClient";

const USER_ACHIEVEMENT_POINTS_QUERY = gql`
  query UserAchievementPoints($userId: String) {
    userAchievementPoints(userId: $userId) {
      earnedPoints
      possiblePoints
      completionPercentage
    }
  }
`;

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
    queryFn: async () => {
      const result = await apolloClient.query<{
        userAchievementPoints: UserAchievementPoints;
      }>({
        query: USER_ACHIEVEMENT_POINTS_QUERY,
        variables: { userId: userId || undefined },
      });
      return result.data?.userAchievementPoints;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
