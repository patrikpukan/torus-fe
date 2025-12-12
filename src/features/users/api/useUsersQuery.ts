import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type UsersQueryItem = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  location?: string | null;
  profileImageUrl?: string | null;
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
  query Users($organizationId: ID) {
    users(organizationId: $organizationId) {
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

export const useUsersQuery = (organizationId?: string) =>
  useQuery<UsersQueryData>(USERS_QUERY, {
    variables: organizationId ? { organizationId } : undefined,
    fetchPolicy: "cache-and-network",
  });
