import { graphql } from "gql.tada";

/**
 * Achievement data type with user-specific unlock status
 */
export type Achievement = {
  achievementId: string;
  name: string;
  description: string;
  imageIdentifier: string;
  type: "milestone" | "social" | "engagement" | "consistency" | "legendary";
  pointValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  targetProgress: number;
  percentComplete: number;
};

/**
 * User achievement with full details
 */
export type UserAchievement = {
  id: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    imageIdentifier: string;
    type: string;
    pointValue: number;
  };
  unlockedAt?: string;
  currentProgress: number;
};

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
 */
export type GetUserAchievementsData = {
  achievements: Achievement[];
};

export type GetUserProfileAchievementsData = {
  userAchievements: UserAchievement[];
};
