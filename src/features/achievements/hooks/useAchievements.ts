import { useQuery } from "@apollo/client/react";
import {
  GET_USER_ACHIEVEMENTS,
  GET_USER_PROFILE_ACHIEVEMENTS,
} from "../graphql/achievement.types";
import type {
  Achievement,
  GetUserAchievementsData,
  GetUserProfileAchievementsData,
} from "../graphql/achievement.types";

/**
 * Hook to fetch current user's achievements with progress
 * Used for achievement dashboard, profile sections
 */
export function useUserAchievements() {
  const { data, loading, error, refetch } = useQuery<GetUserAchievementsData>(
    GET_USER_ACHIEVEMENTS
  );

  return {
    achievements: data?.achievements || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch specific user's unlocked achievements
 * Used for viewing achievements on other users' profiles
 * Maps UserAchievement response to Achievement format for UI consistency
 */
export function useUserProfileAchievements(userId: string) {
  const { data, loading, error, refetch } =
    useQuery<GetUserProfileAchievementsData>(GET_USER_PROFILE_ACHIEVEMENTS, {
      variables: { userId },
      skip: !userId,
    });

  // Map UserAchievement to Achievement format
  const mappedAchievements = (data?.userAchievements || []).map((ua) => ({
    achievementId: ua.achievement.id,
    name: ua.achievement.name,
    description: ua.achievement.description,
    imageIdentifier: ua.achievement.imageIdentifier,
    type: ua.achievement.type as Achievement["type"],
    pointValue: ua.achievement.pointValue,
    isUnlocked: true, // userAchievements only returns unlocked
    unlockedAt: ua.unlockedAt,
    currentProgress: ua.currentProgress,
    targetProgress: ua.currentProgress, // Not available in UserAchievement
    percentComplete: 100, // Always 100% for unlocked
  })) as Achievement[];

  return {
    achievements: mappedAchievements,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to filter achievements by unlock status
 */
export function useFilteredAchievements(
  achievements: Achievement[],
  filter: "all" | "unlocked" | "locked" = "all"
) {
  return achievements.filter((achievement) => {
    if (filter === "unlocked") return achievement.isUnlocked;
    if (filter === "locked") return !achievement.isUnlocked;
    return true;
  });
}

/**
 * Hook to group achievements by type
 */
export function useAchievementsByType(achievements: Achievement[]) {
  const types = [
    "milestone",
    "social",
    "engagement",
    "consistency",
    "legendary",
  ] as const;

  return types.reduce(
    (acc, type) => {
      acc[type] = achievements.filter((a) => a.type === type);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );
}

/**
 * Hook to calculate achievement statistics
 */
export function useAchievementStats(achievements: Achievement[]) {
  const totalAchievements = achievements.length;
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalPoints = achievements.reduce((sum, a) => sum + a.pointValue, 0);
  const earnedPoints = achievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.pointValue, 0);

  return {
    totalAchievements,
    unlockedCount,
    lockedCount: totalAchievements - unlockedCount,
    completionPercentage:
      totalAchievements > 0
        ? Math.round((unlockedCount / totalAchievements) * 100)
        : 0,
    totalPoints,
    earnedPoints,
    potentialPoints: totalPoints - earnedPoints,
  };
}
