import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { USERS_QUERY } from "./useUsersQuery";
import { userByIdQueryKey } from "./useUserByIdQuery";

export type UnbanUserMutationData = {
  unbanUser: {
    id: string;
    activeBan: {
      id: string;
    } | null;
  };
};

type UnbanUserApiResult = {
  id: string;
  activeBan: { id: string } | null;
};

type UnbanMutationArgs = {
  variables: { userId: string };
  // Accepted for call-site compatibility with the old Apollo signature.
  refetchQueries?: unknown;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/users/:id/unban (org_admin / super_admin). Returns the Apollo
 * `useMutation` tuple consumers expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { userId } })` resolves to `{ data: { unbanUser } }`.
 */
export const useUnbanUserMutation = (): [
  (args: UnbanMutationArgs) => Promise<{ data: UnbanUserMutationData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) =>
      apiSend<UnbanUserApiResult>(
        "POST",
        `/users/${encodeURIComponent(userId)}/unban`
      ),
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY });
      void queryClient.invalidateQueries({
        queryKey: userByIdQueryKey(userId),
      });
    },
  });

  const mutate = async ({ variables }: UnbanMutationArgs) => {
    const result = await mutation.mutateAsync(variables.userId);
    return { data: { unbanUser: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
