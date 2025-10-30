import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type OrganizationByIdQueryItem = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationByIdQueryData = {
  organizationById: OrganizationByIdQueryItem | null;
};

export const ORGANIZATION_BY_ID_QUERY = graphql(`
  query OrganizationById($id: ID!) {
    organizationById(id: $id) {
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

export const useOrganizationByIdQuery = (id?: string) =>
  useQuery<OrganizationByIdQueryData>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: id ?? "" },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });
