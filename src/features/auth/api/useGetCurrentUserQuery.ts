import { type GetCurrentUserQuery } from "@/graphql/generated/schema";
import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type CurrentUserData = NonNullable<
  GetCurrentUserQuery["getCurrentUser"]
>;

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
      location
      position
      hobbies {
        id
        name
        category
      }
      interests {
        id
        name
        category
      }
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
    fetchPolicy: "network-only",
    skip: options?.skip,
  });
