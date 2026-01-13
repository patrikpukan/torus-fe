import type {
  GetUserAchievementsQuery,
  GetUserProfileAchievementsQuery,
} from "@/graphql/generated/schema";
import { graphql } from "gql.tada";

/**
 * Achievement data type with user-specific unlock status
 * Extracted from GetUserAchievementsQuery result
 */
export type Achievement = NonNullable<
  GetUserAchievementsQuery["achievements"][number]
>;

/**
 * User achievement with full details
 * Extracted from GetUserProfileAchievementsQuery result
 */
export type UserAchievement = NonNullable<
  GetUserProfileAchievementsQuery["userAchievements"][number]
>;

/**
 * User achievement mapped to display format (for profile view)
 * Converts UserAchievement to Achievement format for UI consistency
 */
export type ProfileAchievement = Achievement & {
  id?: string; // Add id for consistency with UserAchievement
};

/**
 * GraphQL query for user's achievements
 */
export const GET_USER_ACHIEVEMENTS = graphql(`
  query GetUserAchievements {
    achievements {
      achievementId
      name
      description
      imageIdentifier
      type
      pointValue
      isUnlocked
      unlockedAt
      currentProgress
      targetProgress
      percentComplete
    }
  }
`);

/**
 * GraphQL query for specific user's unlocked achievements
 */
export const GET_USER_PROFILE_ACHIEVEMENTS = graphql(`
  query GetUserProfileAchievements($userId: String!) {
    userAchievements(userId: $userId) {
      id
      achievement {
        id
        name
        description
        imageIdentifier
        type
        pointValue
      }
      unlockedAt
      currentProgress
    }
  }
`);

/**
 * Response types for queries
 * Using generated types from schema
 */
export type GetUserAchievementsData = GetUserAchievementsQuery;

export type GetUserProfileAchievementsData = GetUserProfileAchievementsQuery;
