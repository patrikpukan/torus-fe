import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";
import type { UsersQueryItem } from "./useUsersQuery";

export type GetPairedUsersData = {
  getPairedUsers: UsersQueryItem[];
};

export const GET_PAIRED_USERS_QUERY = graphql(`
  query GetPairedUsers {
    getPairedUsers {
      id
      email
      username
      firstName
      lastName
      profileStatus
      role
    }
  }
`);

export const useGetPairedUsersQuery = () =>
  useQuery<GetPairedUsersData>(GET_PAIRED_USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
