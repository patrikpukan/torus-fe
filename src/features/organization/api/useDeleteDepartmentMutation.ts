import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { departmentsByOrganizationKey } from "./useGetDepartmentsByOrganizationQuery";

export type DeleteDepartmentInput = {
  id: string;
  organizationId: string;
};

type DeleteDepartmentArgs = {
  variables: { input: DeleteDepartmentInput };
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Preserves the
 * Apollo tuple call shape: `const [deleteDept, { loading }] = useDeleteDepartmentMutation(orgId);`
 * then `await deleteDept({ variables: { input } })`, and the
 * `{ deleteDepartment: boolean }` return shape. Sends organizationId in the body
 * so the backend can run its org-scoped delete check. Invalidates the
 * organization's department list on success.
 */
export const useDeleteDepartmentMutation = (
  organizationId: string
): [
  (args: DeleteDepartmentArgs) => Promise<{ deleteDepartment: boolean }>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: DeleteDepartmentInput) =>
      apiSend<{ success: boolean }>("DELETE", `/departments/${input.id}`, {
        organizationId: input.organizationId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: departmentsByOrganizationKey(organizationId),
      });
    },
  });

  const deleteDepartment = async ({
    variables,
  }: DeleteDepartmentArgs): Promise<{ deleteDepartment: boolean }> => {
    const result = await mutation.mutateAsync(variables.input);
    return { deleteDepartment: result.success };
  };

  return [deleteDepartment, { loading: mutation.isPending }];
};
