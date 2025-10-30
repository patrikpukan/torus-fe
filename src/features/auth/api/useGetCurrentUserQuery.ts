import { type GetCurrentUserQuery } from "@/graphql/generated/schema";
import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type CurrentUserData = {
  id: string;
  email: string;
  username?: string | null;
  organizationId: string;
  role: "user" | "org_admin" | "super_admin";
  firstName?: string | null;
  lastName?: string | null;
  about?: string | null;
  hobbies?: string | null;
  preferredActivity?: string | null;
  interests?: string | null;
  profileImageUrl?: string | null;
  displayUsername?: string | null;
  profileStatus?: string | null;
  isActive?: boolean;
  organization?: {
    id: string;
    name: string;
    code: string;
    imageUrl?: string | null;
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
      username
      organizationId
      role
      firstName
      lastName
      about
      hobbies
      preferredActivity
      interests
      profileImageUrl
      displayUsername
      profileStatus
      isActive
      organization {
        id
        name
        code
        imageUrl
      }
    }
  }
`);

export const useGetCurrentUserQuery = (options?: { skip?: boolean }) =>
  useQuery<GetCurrentUserQuery>(GET_CURRENT_USER, {
    fetchPolicy: "cache-first",
    skip: options?.skip,
  });
