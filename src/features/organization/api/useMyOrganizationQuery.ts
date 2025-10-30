import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type MyOrganizationQueryItem = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MyOrganizationQueryData = {
  myOrganization: MyOrganizationQueryItem | null;
};

export const MY_ORGANIZATION_QUERY = graphql(`
  query MyOrganization {
    myOrganization {
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

export const useMyOrganizationQuery = () =>
  useQuery<MyOrganizationQueryData>(MY_ORGANIZATION_QUERY, {
    fetchPolicy: "cache-and-network",
  });
