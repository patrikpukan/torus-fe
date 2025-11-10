import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type BanUserInput = {
  userId: string;
  reason: string;
  expiresAt?: string | null;
};

export type BanUserMutationData = {
  banUser: {
    id: string;
    activeBan: {
      id: string;
      reason: string;
      createdAt: string;
      expiresAt?: string | null;
    } | null;
  };
};

export const BAN_USER_MUTATION = graphql(`
  mutation BanUser($input: BanUserInput!) {
    banUser(input: $input) {
      id
      activeBan {
        id
        reason
        createdAt
        expiresAt
      }
    }
  }
`);

export const useBanUserMutation = () =>
  useMutation<BanUserMutationData, { input: BanUserInput }>(BAN_USER_MUTATION);
