import { useMutation } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";

export type RegisterOrganizationInput = {
  adminEmail: string;
  organizationName: string;
  organizationSize: string;
  organizationAddress: string;
};

export type RegisterOrganizationResponse = {
  registerOrganization: {
    organization: {
      id: string;
      name: string;
      code: string;
      size?: number | null;
      address?: string | null;
      createdAt: string;
      updatedAt: string;
    };
    adminEmail: string;
    message: string;
  };
};

type RegisterOrganizationArgs = {
  variables: { input: RegisterOrganizationInput };
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/organizations/register — PUBLIC. Works WITHOUT a session:
 * restClient.apiSend only attaches a bearer token when a Supabase session
 * exists and does not throw when there is none, so unauthenticated registration
 * still reaches the public endpoint.
 *
 * Preserves the Apollo tuple call shape so CreateOrganizationForm keeps working:
 *   const [registerOrganization, { loading }] = useRegisterOrganization();
 *   const result = await registerOrganization({ variables: { input } });
 *   result.data.registerOrganization.message
 */
export const useRegisterOrganization = (): [
  (
    args: RegisterOrganizationArgs
  ) => Promise<{ data: RegisterOrganizationResponse }>,
  { loading: boolean },
] => {
  const mutation = useMutation({
    mutationFn: (input: RegisterOrganizationInput) =>
      apiSend<RegisterOrganizationResponse["registerOrganization"]>(
        "POST",
        "/organizations/register",
        input
      ),
  });

  const registerOrganization = async ({
    variables,
  }: RegisterOrganizationArgs): Promise<{
    data: RegisterOrganizationResponse;
  }> => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { registerOrganization: result } };
  };

  return [registerOrganization, { loading: mutation.isPending }];
};
