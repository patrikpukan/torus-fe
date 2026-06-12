import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type PeriodTrend = {
  periodId: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  pairingsCount: number;
  metPairingsCount: number;
  meetingCompletionRate: number;
  pairedUsersCount: number;
  activeUsersCount: number;
  participationRate: number;
  averageRating?: number | null;
  ratingsCount: number;
  didNotMeetCount: number;
};

export type StatisticsTrendsQueryData = {
  statisticsTrends: {
    trends: PeriodTrend[];
  };
};

export const STATISTICS_TRENDS_QUERY = graphql(`
  query StatisticsTrends($organizationId: String, $limit: Int) {
    statisticsTrends(organizationId: $organizationId, limit: $limit) {
      trends {
        periodId
        startDate
        endDate
        status
        pairingsCount
        metPairingsCount
        meetingCompletionRate
        pairedUsersCount
        activeUsersCount
        participationRate
        averageRating
        ratingsCount
        didNotMeetCount
      }
    }
  }
`);

export const useStatisticsTrendsQuery = (
  organizationId?: string | null,
  limit = 8
) =>
  useQuery<StatisticsTrendsQueryData>(STATISTICS_TRENDS_QUERY, {
    variables: { organizationId: organizationId ?? null, limit },
    fetchPolicy: "cache-and-network",
  });
