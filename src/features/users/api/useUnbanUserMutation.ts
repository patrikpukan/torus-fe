import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type UnbanUserMutationData = {
  unbanUser: {
    id: string;
    activeBan: {
      id: string;
    } | null;
  };
};

export const UNBAN_USER_MUTATION = graphql(`
  mutation UnbanUser($userId: ID!) {
    unbanUser(userId: $userId) {
      id
      activeBan {
        id
      }
    }
  }
`);

export const useUnbanUserMutation = () =>
  useMutation<UnbanUserMutationData, { userId: string }>(UNBAN_USER_MUTATION);
