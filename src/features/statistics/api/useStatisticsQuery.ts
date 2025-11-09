import type {
  StatisticsFilterInputType,
  StatisticsResponseType,
} from "@/graphql/generated/schema";
import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type StatisticsFilter = StatisticsFilterInputType;

export type StatisticsQueryData = {
  statistics: StatisticsResponseType;
};

export const STATISTICS_QUERY = graphql(`
  query Statistics($filter: StatisticsFilterInputType) {
    statistics(filter: $filter) {
      newUsersCount
      inactiveUsersCount
      reportsCount
      pairingsByStatus {
        status
        count
      }
      pairingsByStatusAndUser {
        userId
        userEmail
        userName
        status
        count
      }
    }
  }
`);

export const useStatisticsQuery = (filter?: StatisticsFilter) => {
  return useQuery<StatisticsQueryData>(STATISTICS_QUERY, {
    variables: filter ? { filter } : undefined,
    fetchPolicy: "cache-and-network",
  });
};

