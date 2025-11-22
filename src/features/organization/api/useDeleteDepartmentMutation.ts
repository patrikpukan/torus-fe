import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import {
  GET_DEPARTMENTS_BY_ORGANIZATION_QUERY,
  type GetDepartmentsByOrganizationVariables,
} from "./useGetDepartmentsByOrganizationQuery";

export type DeleteDepartmentInput = {
  id: string;
  organizationId: string;
};

export const DELETE_DEPARTMENT_MUTATION = graphql(`
  mutation DeleteDepartment($input: DeleteDepartmentInput!) {
    deleteDepartment(input: $input)
  }
`);

export const useDeleteDepartmentMutation = (organizationId: string) =>
  useMutation<{ deleteDepartment: boolean }, { input: DeleteDepartmentInput }>(
    DELETE_DEPARTMENT_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_DEPARTMENTS_BY_ORGANIZATION_QUERY,
          variables: {
            organizationId,
          } as GetDepartmentsByOrganizationVariables,
        },
      ],
    }
  );
