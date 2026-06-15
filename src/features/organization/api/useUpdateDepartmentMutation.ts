import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import {
  departmentsByOrganizationKey,
  type Department,
} from "./useGetDepartmentsByOrganizationQuery";

export type UpdateDepartmentInput = {
  id: string;
  name: string;
  description?: string | null;
};

export type UpdateDepartmentMutationData = {
  updateDepartment: Department;
};

type UpdateDepartmentArgs = {
  variables: { input: UpdateDepartmentInput };
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Preserves the
 * Apollo tuple call shape: `const [updateDept, { loading }] = useUpdateDepartmentMutation();`
 * then `await updateDept({ variables: { input } })`. Invalidates the updated
 * department's organization list on success (the response carries
 * organizationId, matching the old dynamic refetchQueries).
 */
export const useUpdateDepartmentMutation = (): [
  (args: UpdateDepartmentArgs) => Promise<UpdateDepartmentMutationData>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...body }: UpdateDepartmentInput) =>
      apiSend<Department>("PATCH", `/departments/${id}`, body),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: departmentsByOrganizationKey(updated.organizationId),
      });
    },
  });

  const updateDepartment = async ({
    variables,
  }: UpdateDepartmentArgs): Promise<UpdateDepartmentMutationData> => {
    const updated = await mutation.mutateAsync(variables.input);
    return { updateDepartment: updated };
  };

  return [updateDepartment, { loading: mutation.isPending }];
};
