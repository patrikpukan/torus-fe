import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type MyEngagementStats = {
  currentStreak: number;
  meetingsCompleted: number;
  colleaguesConnected: number;
};

export type MyEngagementStatsQueryData = {
  myEngagementStats: MyEngagementStats;
};

export const MY_ENGAGEMENT_STATS_QUERY = graphql(`
  query MyEngagementStats {
    myEngagementStats {
      currentStreak
      meetingsCompleted
      colleaguesConnected
    }
  }
`);

export const useMyEngagementStats = () =>
  useQuery<MyEngagementStatsQueryData>(MY_ENGAGEMENT_STATS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
