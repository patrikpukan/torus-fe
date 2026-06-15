import { useMutation } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";

export type InviteUserInput = {
  email: string;
  organizationId: string;
};

export type InviteUserResult = {
  success: boolean;
  message: string;
  userId?: string;
};

export type InviteUserMutationData = {
  inviteUserToOrganization: InviteUserResult;
};

type InviteUserArgs = {
  variables: { input: InviteUserInput };
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/organizations/invite-user (org_admin|super_admin).
 *
 * Preserves the Apollo tuple call shape so InviteUserModal keeps working:
 *   const [inviteUser, { loading }] = useInviteUserToOrganizationMutation();
 *   const { data } = await inviteUser({ variables: { input } });
 *   data.inviteUserToOrganization // { success, message, userId }
 */
export const useInviteUserToOrganizationMutation = (): [
  (args: InviteUserArgs) => Promise<{ data: InviteUserMutationData }>,
  { loading: boolean },
] => {
  const mutation = useMutation({
    mutationFn: (input: InviteUserInput) =>
      apiSend<InviteUserResult>("POST", "/organizations/invite-user", input),
  });

  const inviteUser = async ({
    variables,
  }: InviteUserArgs): Promise<{ data: InviteUserMutationData }> => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { inviteUserToOrganization: result } };
  };

  return [inviteUser, { loading: mutation.isPending }];
};
