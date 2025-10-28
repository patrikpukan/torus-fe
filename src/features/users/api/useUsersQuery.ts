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

export const USERS_QUERY = gql`
  query Users {
    users {
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

export const useUsersQuery = () =>
  useQuery<UsersQueryData>(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
