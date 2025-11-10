import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type UsersQueryItem = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileStatus?: string | null;
  role?: string | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
};

export type UsersQueryData = {
  users: UsersQueryItem[];
};

export const USERS_QUERY = graphql(`
  query Users {
    users {
      id
      email
      firstName
      lastName
      profileStatus
      role
      activeBan {
        id
        reason
        createdAt
        expiresAt
      }
    }
  }
`);

export const useUsersQuery = () =>
  useQuery<UsersQueryData>(USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
