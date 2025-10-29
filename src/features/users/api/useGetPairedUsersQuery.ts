import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { UsersQueryItem } from "./useUsersQuery";

export type GetPairedUsersData = {
  getPairedUsers: UsersQueryItem[];
};

export const GET_PAIRED_USERS_QUERY = gql`
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
`;

export const useGetPairedUsersQuery = () =>
  useQuery<GetPairedUsersData>(GET_PAIRED_USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
