import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export const UPDATE_ORGANIZATION_MUTATION = graphql(`
  mutation UpdateOrganization($input: UpdateOrganizationInputType!) {
    updateOrganization(input: $input) {
      id
      name
      code
      size
      address
      imageUrl
      createdAt
      updatedAt
    }
  }
`);

export const useUpdateOrganizationMutation = () =>
  useMutation(UPDATE_ORGANIZATION_MUTATION);
