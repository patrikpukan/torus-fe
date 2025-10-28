import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { UsersQueryItem } from "./useUsersQuery";

export type UserByIdQueryData = {
  userById: UsersQueryItem | null;
};

export type UserByIdQueryVariables = {
  id?: string;
};

export const USER_BY_ID_QUERY = gql`
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
`;

export const useUserByIdQuery = (id?: string) =>
  useQuery<UserByIdQueryData, UserByIdQueryVariables>(USER_BY_ID_QUERY, {
    skip: !id,
    variables: id ? { id } : undefined,
  });
