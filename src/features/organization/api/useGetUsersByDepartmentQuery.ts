import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type DepartmentUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role: string;
};

export type GetUsersByDepartmentData = {
  getUsersByDepartment: DepartmentUser[];
};

export type GetUsersByDepartmentVariables = {
  departmentId: string;
};

export const GET_USERS_BY_DEPARTMENT_QUERY = graphql(`
  query GetUsersByDepartment($departmentId: String!) {
    getUsersByDepartment(departmentId: $departmentId) {
      id
      email
      firstName
      lastName
      profileImageUrl
      role
    }
  }
`);

export const useGetUsersByDepartmentQuery = (departmentId?: string) =>
  useQuery<GetUsersByDepartmentData, GetUsersByDepartmentVariables>(
    GET_USERS_BY_DEPARTMENT_QUERY,
    {
      skip: !departmentId,
      variables: departmentId ? { departmentId } : { departmentId: "" },
    }
  );
