import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type Department = {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GetDepartmentsByOrganizationData = {
  getDepartmentsByOrganization: Department[];
};

export type GetDepartmentsByOrganizationVariables = {
  organizationId: string;
};

export const GET_DEPARTMENTS_BY_ORGANIZATION_QUERY = graphql(`
  query GetDepartmentsByOrganization($organizationId: String!) {
    getDepartmentsByOrganization(organizationId: $organizationId) {
      id
      name
      description
      organizationId
      employeeCount
      createdAt
      updatedAt
    }
  }
`);

export const useGetDepartmentsByOrganizationQuery = (organizationId?: string) =>
  useQuery<GetDepartmentsByOrganizationData, GetDepartmentsByOrganizationVariables>(
    GET_DEPARTMENTS_BY_ORGANIZATION_QUERY,
    {
      skip: !organizationId,
      variables: organizationId ? { organizationId } : undefined,
    }
  );
