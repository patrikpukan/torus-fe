import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type OrganizationQueryItem = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrganizationsQueryData = {
  organizations: OrganizationQueryItem[];
};

export const ORGANIZATIONS_QUERY = graphql(`
  query Organizations {
    organizations {
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

export const useOrganizationsQuery = () =>
  useQuery<OrganizationsQueryData>(ORGANIZATIONS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
