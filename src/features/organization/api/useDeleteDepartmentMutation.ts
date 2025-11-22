import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type DeleteDepartmentInput = {
  id: string;
  organizationId: string;
};

export const DELETE_DEPARTMENT_MUTATION = graphql(`
  mutation DeleteDepartment($input: DeleteDepartmentInput!) {
    deleteDepartment(input: $input)
  }
`);

export const useDeleteDepartmentMutation = () =>
  useMutation<{ deleteDepartment: boolean }, { input: DeleteDepartmentInput }>(
    DELETE_DEPARTMENT_MUTATION
  );
