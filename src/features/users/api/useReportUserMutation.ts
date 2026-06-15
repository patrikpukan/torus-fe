import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { GET_PAIRED_USERS_QUERY } from "./useGetPairedUsersQuery";

export type ReportUserInput = {
  reportedUserId: string;
  reason: string;
};

export type ReportUserMutationData = {
  reportUser: {
    id: string;
    reporterId: string;
    reportedUserId: string;
    pairingId: string;
    reason: string;
    createdAt: string;
  };
};

type ReportUserApiResult = ReportUserMutationData["reportUser"];

type ReportMutationArgs = {
  variables: { input: ReportUserInput };
  // Accepted for call-site compatibility with the old Apollo signature.
  refetchQueries?: unknown;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/users/report. Returns the Apollo `useMutation` tuple consumers
 * expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to `{ data: { reportUser } }`.
 * On success the paired-users list is invalidated (reported users are filtered
 * out), replacing the old `refetchQueries`.
 */
export const useReportUserMutation = (): [
  (args: ReportMutationArgs) => Promise<{ data: ReportUserMutationData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: ReportUserInput) =>
      apiSend<ReportUserApiResult>("POST", "/users/report", input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GET_PAIRED_USERS_QUERY });
    },
  });

  const mutate = async ({ variables }: ReportMutationArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { reportUser: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
