import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type TagObject = {
  id: string;
  name: string;
  category: "HOBBY" | "INTEREST";
};

export type UserDetail = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileStatus?: string | null;
  role?: string | null;
  hobbies?: TagObject[] | null;
  interests?: TagObject[] | null;
  activeBan?: {
    id: string;
    reason: string;
    createdAt: string;
    expiresAt?: string | null;
  } | null;
};

export type UserByIdQueryData = {
  userById: UserDetail | null;
};

export type UserByIdQueryVariables = {
  id?: string;
};

export const USER_BY_ID_QUERY = graphql(`
  query UserById($id: ID!) {
    userById(id: $id) {
      id
      email
      firstName
      lastName
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

export const useUserByIdQuery = (id?: string) =>
  useQuery<UserByIdQueryData, UserByIdQueryVariables>(USER_BY_ID_QUERY, {
    skip: !id,
    variables: id ? { id } : undefined,
  });
