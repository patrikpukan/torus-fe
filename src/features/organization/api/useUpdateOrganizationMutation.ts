import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";

export type UpdateOrganizationInput = {
  id: string;
  name?: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
};

export type UpdateOrganizationResult = {
  id: string;
  name: string;
  code: string;
  size?: number | null;
  address?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateOrganizationMutationData = {
  updateOrganization: UpdateOrganizationResult;
};

type UpdateOrganizationArgs = {
  variables: { input: UpdateOrganizationInput };
  // Accepted for source compatibility with the old Apollo call site
  // (refetchQueries). Ignored — react-query invalidation handles refetching.
  refetchQueries?: unknown;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * PUT /api/organizations/:id (org_admin|super_admin + assertSameOrg). `id` is
 * taken from the input and used as the route param; the rest is the JSON body.
 *
 * Preserves the Apollo tuple call shape so OrganizationDetailPage keeps working:
 *   const [updateOrganization, { loading }] = useUpdateOrganizationMutation();
 *   const { data } = await updateOrganization({ variables: { input } });
 *   data.updateOrganization // updated org
 */
export const useUpdateOrganizationMutation = (): [
  (
    args: UpdateOrganizationArgs
  ) => Promise<{ data: UpdateOrganizationMutationData }>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...body }: UpdateOrganizationInput) =>
      apiSend<UpdateOrganizationResult>(
        "PUT",
        `/organizations/${encodeURIComponent(id)}`,
        body
      ),
    onSuccess: () => {
      // Mirror the old refetchQueries (MyOrganization / OrganizationById /
      // Organizations) by invalidating all organization queries.
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const updateOrganization = async ({
    variables,
  }: UpdateOrganizationArgs): Promise<{
    data: UpdateOrganizationMutationData;
  }> => {
    const updated = await mutation.mutateAsync(variables.input);
    return { data: { updateOrganization: updated } };
  };

  return [updateOrganization, { loading: mutation.isPending }];
};
