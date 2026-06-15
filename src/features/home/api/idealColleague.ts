import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { GET_CURRENT_USER } from "@/features/auth/api/useGetCurrentUserQuery";

export type FindIdealColleagueData = {
  findIdealColleague: string;
};

/**
 * React-query mutation key for the "find ideal colleague" action. Previously a
 * GraphQL document `FIND_IDEAL_COLLEAGUE`; kept exported under the same name
 * for any references.
 */
export const FIND_IDEAL_COLLEAGUE = ["users", "find-ideal-colleague"] as const;

type FindIdealColleagueApiResult = {
  id: string;
};

type FindIdealColleagueArgs = {
  // Accepted for call-site compatibility with the old Apollo signature; the
  // current-user key is invalidated internally. PAIRINGS (still Apollo) and the
  // active-pairing-period (react-query) keys are refreshed by the caller.
  refetchQueries?: unknown;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/users/find-ideal-colleague (returns the new pairing id). Returns
 * the Apollo `useMutation` tuple consumers expect: `[mutateFn, { loading }]`,
 * where `mutateFn()` resolves to `{ data: { findIdealColleague } }` (the id
 * string). On success the current-user query is invalidated so the remaining
 * uses count refreshes.
 */
export const useFindIdealColleague = (): [
  (args?: FindIdealColleagueArgs) => Promise<{ data: FindIdealColleagueData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      apiSend<FindIdealColleagueApiResult>(
        "POST",
        "/users/find-ideal-colleague"
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: GET_CURRENT_USER });
    },
  });

  const mutate = async () => {
    const result = await mutation.mutateAsync();
    return { data: { findIdealColleague: result.id } };
  };

  return [mutate, { loading: mutation.isPending }];
};
