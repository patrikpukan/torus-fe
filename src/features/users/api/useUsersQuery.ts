import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export type UsersQueryItem = {
  id: string;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  profileStatus?: string | null;
  role?: string | null;
};

export type UsersQueryData = {
  users: UsersQueryItem[];
};

export type UsersQueryVariables = {
  offset?: number;
  limit?: number;
};

export const USERS_QUERY = gql`
  query Users($offset: Int, $limit: Int) {
    users(offset: $offset, limit: $limit) {
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

export const useUsersQuery = (variables?: UsersQueryVariables) =>
  useQuery<UsersQueryData, UsersQueryVariables>(USERS_QUERY, {
    variables,
    fetchPolicy: "cache-and-network",
  });
