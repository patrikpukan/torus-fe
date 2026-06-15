import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { USERS_QUERY } from "./useUsersQuery";
import { userByIdQueryKey } from "./useUserByIdQuery";

export type BanUserInput = {
  userId: string;
  reason: string;
  expiresAt?: string | null;
};

export type BanUserMutationData = {
  banUser: {
    id: string;
    activeBan: {
      id: string;
      reason: string;
      createdAt: string;
      expiresAt?: string | null;
    } | null;
  };
};

type BanUserApiResult = BanUserMutationData["banUser"];

type BanMutationArgs = {
  variables: { input: BanUserInput };
  // Accepted for call-site compatibility with the old Apollo signature;
  // invalidation is handled internally via the query client.
  refetchQueries?: unknown;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/users/:id/ban (org_admin / super_admin). Returns the Apollo
 * `useMutation` tuple consumers expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to `{ data: { banUser } }`.
 * On success the users list and the affected user-by-id query are invalidated
 * (replacing the old `refetchQueries`).
 */
export const useBanUserMutation = (): [
  (args: BanMutationArgs) => Promise<{ data: BanUserMutationData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: BanUserInput) =>
      apiSend<BanUserApiResult>(
        "POST",
        `/users/${encodeURIComponent(input.userId)}/ban`,
        { reason: input.reason, expiresAt: input.expiresAt ?? null }
      ),
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY });
      void queryClient.invalidateQueries({
        queryKey: userByIdQueryKey(input.userId),
      });
    },
  });

  const mutate = async ({ variables }: BanMutationArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { banUser: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
