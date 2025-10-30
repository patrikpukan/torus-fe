import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export const INVITE_USER_TO_ORGANIZATION_MUTATION = graphql(`
  mutation InviteUserToOrganization($input: InviteUserInputType!) {
    inviteUserToOrganization(input: $input) {
      success
      message
      userId
    }
  }
`);

export const useInviteUserToOrganizationMutation = () =>
  useMutation(INVITE_USER_TO_ORGANIZATION_MUTATION);
