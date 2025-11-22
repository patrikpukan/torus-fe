import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import {
  GET_DEPARTMENTS_BY_ORGANIZATION_QUERY,
  type GetDepartmentsByOrganizationVariables,
} from "./useGetDepartmentsByOrganizationQuery";

export type UpdateDepartmentInput = {
  id: string;
  name: string;
  description?: string | null;
};

export type UpdateDepartmentMutationData = {
  updateDepartment: {
    id: string;
    name: string;
    description?: string | null;
    organizationId: string;
    employeeCount: number;
    createdAt: string;
    updatedAt: string;
  };
};

export const UPDATE_DEPARTMENT_MUTATION = graphql(`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
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

export const useUpdateDepartmentMutation = () =>
  useMutation<UpdateDepartmentMutationData, { input: UpdateDepartmentInput }>(
    UPDATE_DEPARTMENT_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_DEPARTMENTS_BY_ORGANIZATION_QUERY,
          variables: (mutationResult) =>
            ({
              organizationId: (
                mutationResult.data
                  ?.updateDepartment as UpdateDepartmentMutationData["updateDepartment"]
              ).organizationId,
            }) as GetDepartmentsByOrganizationVariables,
        },
      ],
    }
  );
