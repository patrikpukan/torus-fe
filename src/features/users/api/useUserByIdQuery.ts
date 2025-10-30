import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type UserDetail = {
  id: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileStatus?: string | null;
  role?: string | null;
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
      username
      firstName
      lastName
      profileStatus
      role
    }
  }
`);

export const useUserByIdQuery = (id?: string) =>
  useQuery<UserByIdQueryData, UserByIdQueryVariables>(USER_BY_ID_QUERY, {
    skip: !id,
    variables: id ? { id } : undefined,
  });
