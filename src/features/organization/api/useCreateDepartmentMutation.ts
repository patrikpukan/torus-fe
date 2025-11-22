import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type CreateDepartmentInput = {
  name: string;
  description?: string | null;
  organizationId: string;
};

export type CreateDepartmentMutationData = {
  createDepartment: {
    id: string;
    name: string;
    description?: string | null;
    organizationId: string;
    employeeCount: number;
    createdAt: string;
    updatedAt: string;
  };
};

export const CREATE_DEPARTMENT_MUTATION = graphql(`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
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

export const useCreateDepartmentMutation = () =>
  useMutation<CreateDepartmentMutationData, { input: CreateDepartmentInput }>(
    CREATE_DEPARTMENT_MUTATION
  );
