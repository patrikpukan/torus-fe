import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import {
  departmentsByOrganizationKey,
  type Department,
} from "./useGetDepartmentsByOrganizationQuery";

export type CreateDepartmentInput = {
  name: string;
  description?: string | null;
  organizationId: string;
};

export type CreateDepartmentMutationData = {
  createDepartment: Department;
};

type CreateDepartmentArgs = {
  variables: { input: CreateDepartmentInput };
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Preserves the
 * Apollo tuple call shape: `const [createDept, { loading }] = useCreateDepartmentMutation(orgId);`
 * then `await createDept({ variables: { input } })`. Invalidates the
 * organization's department list on success (matched the old refetchQueries).
 */
export const useCreateDepartmentMutation = (
  organizationId: string
): [
  (args: CreateDepartmentArgs) => Promise<CreateDepartmentMutationData>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateDepartmentInput) =>
      apiSend<Department>("POST", "/departments", input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentsByOrganizationKey(organizationId),
      });
    },
  });

  const createDepartment = async ({
    variables,
  }: CreateDepartmentArgs): Promise<CreateDepartmentMutationData> => {
    const created = await mutation.mutateAsync(variables.input);
    return { createDepartment: created };
  };

  return [createDepartment, { loading: mutation.isPending }];
};
