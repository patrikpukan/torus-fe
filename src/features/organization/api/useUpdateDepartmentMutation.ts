import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

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
    UPDATE_DEPARTMENT_MUTATION
  );
