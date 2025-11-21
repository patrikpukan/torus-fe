import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";
import type { ReportUserSummary } from "./useReportsQuery";

export type ReportDetail = {
  id: string;
  createdAt: string;
  reason: string;
  status: "pending" | "resolved";
  resolvedAt?: string | null;
  reporter: ReportUserSummary;
  reportedUser: ReportUserSummary;
  resolutionNote?: string | null;
  resolvedBy?: ReportUserSummary | null;
};

export type ReportByIdQueryData = {
  reportById: ReportDetail | null;
};

export type ReportByIdQueryVariables = {
  id: string;
};

export const REPORT_BY_ID_QUERY = graphql(`
  query ReportById($id: ID!) {
    reportById(id: $id) {
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
      resolvedBy {
        id
        firstName
        lastName
        email
      }
      resolutionNote
    }
  }
`);

export const useReportByIdQuery = (id?: string) =>
  useQuery<ReportByIdQueryData, ReportByIdQueryVariables>(REPORT_BY_ID_QUERY, {
    skip: !id,
    variables: { id: id ?? "" },
  });
