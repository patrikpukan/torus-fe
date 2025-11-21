import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ReportUserSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export type ReportsQueryItem = {
  id: string;
  createdAt: string;
  reason: string;
  status: "pending" | "resolved";
  resolvedAt?: string | null;
  reporter: ReportUserSummary;
  reportedUser: ReportUserSummary;
};

export type ReportsQueryData = {
  reports: ReportsQueryItem[];
};

export const REPORTS_QUERY = graphql(`
  query Reports {
    reports {
      id
      createdAt
      reason
      status
      resolvedAt
      reporter {
        id
        firstName
        lastName
        email
      }
      reportedUser {
        id
        firstName
        lastName
        email
      }
    }
  }
`);

export const useReportsQuery = () =>
  useQuery<ReportsQueryData>(REPORTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
