import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import type { ReportsQueryItem } from "./useReportsQuery";

export type ResolveReportInput = {
  reportId: string;
  resolutionNote?: string | null;
};

export type ResolveReportMutationData = {
  resolveReport: {
    id: string;
    status: ReportsQueryItem["status"];
    resolvedBy?: {
      id: string;
    } | null;
  };
};

export const RESOLVE_REPORT_MUTATION = graphql(`
  mutation ResolveReport($input: ResolveReportInput!) {
    resolveReport(input: $input) {
      id
      status
      resolvedBy {
        id
      }
    }
  }
`);

export const useResolveReportMutation = () =>
  useMutation<ResolveReportMutationData, { input: ResolveReportInput }>(
    RESOLVE_REPORT_MUTATION
  );

