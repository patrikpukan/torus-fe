import { type GetCurrentUserQuery } from "@/graphql/generated/schema";
import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type CurrentUserData = {
  id: string;
  email: string;
  organizationId: string;
  role: "user" | "org_admin" | "super_admin";
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  hobbies?: string | null;
  interests?: string | null;
  profileImageUrl?: string | null;
  profileStatus?: string | null;
  isActive?: boolean;
  preferredActivity?: string | null;
  suspendedUntil?: string | null;
  departmentId?: string | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
  organization?: {
    id: string;
    name: string;
    code: string;
    imageUrl?: string | null;
  } | null;
  department?: {
    id: string;
    name: string;
  } | null;
};

export type GetCurrentUserResponse = {
  getCurrentUser: CurrentUserData | null;
};

export const GET_CURRENT_USER = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      organizationId
      role
      firstName
      lastName
      about
      hobbies
      interests
      profileImageUrl
      profileStatus
      isActive
      preferredActivity
      suspendedUntil
      departmentId
      activeBan {
        id
        reason
        createdAt
        expiresAt
      }
      organization {
        id
        name
        code
        imageUrl
      }
      department {
        id
        name
      }
    }
  }
`);

export const useGetCurrentUserQuery = (options?: { skip?: boolean }) =>
  useQuery<GetCurrentUserQuery>(GET_CURRENT_USER, {
    fetchPolicy: "cache-first",
    skip: options?.skip,
  });
