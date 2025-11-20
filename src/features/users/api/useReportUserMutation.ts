import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ReportUserInput = {
  reportedUserId: string;
  reason: string;
};

export type ReportUserMutationData = {
  reportUser: {
    id: string;
    reporterId: string;
    reportedUserId: string;
    pairingId: string;
    reason: string;
    createdAt: string;
  };
};

export const REPORT_USER_MUTATION = graphql(`
  mutation ReportUser($input: ReportUserInput!) {
    reportUser(input: $input) {
      id
      reporterId
      reportedUserId
      pairingId
      reason
      createdAt
    }
  }
`);

export const useReportUserMutation = () =>
  useMutation<ReportUserMutationData, { input: ReportUserInput }>(
    REPORT_USER_MUTATION
  );

