import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";
import type { UsersQueryItem } from "./useUsersQuery";

export type AnonUsersQueryItem = UsersQueryItem;

export type AnonUsersQueryData = {
  anonUsers: AnonUsersQueryItem[];
};

export const ANON_USERS_QUERY = graphql(`
  query AnonUsers {
    anonUsers {
      id
      email
      firstName
      lastName
      location
      profileImageUrl
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

export const useAnonUsersQuery = () =>
  useQuery<AnonUsersQueryData>(ANON_USERS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
