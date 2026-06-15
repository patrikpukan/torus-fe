import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import { UNRATED_MEETINGS_QUERY_KEY } from "./useUnratedMeetingsQuery";

export type CreateRatingMutationData = {
  createRating: {
    id: string;
    meetingEventId: string;
    stars: number;
    feedback?: string | null;
  };
};

export type CreateRatingMutationVariables = {
  input: {
    meetingEventId: string;
    stars: number;
    feedback?: string | null;
  };
};

type CreateRatingResponse = {
  id: string;
  meetingEventId: string;
  stars: number;
  feedback?: string | null;
};

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Preserves the
 * Apollo tuple call shape: `const [createRating, { loading }] = useCreateRatingMutation();`
 * then `await createRating({ variables: { input } })`. On success it invalidates
 * the unrated-meetings query so the prompt list refreshes (matched the old
 * Apollo cache evict + refetch).
 */
export const useCreateRatingMutation = (): [
  (args: {
    variables: CreateRatingMutationVariables;
  }) => Promise<CreateRatingMutationData>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CreateRatingMutationVariables["input"]) =>
      apiSend<CreateRatingResponse>("POST", "/ratings", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNRATED_MEETINGS_QUERY_KEY });
    },
  });

  const createRating = async ({
    variables,
  }: {
    variables: CreateRatingMutationVariables;
  }): Promise<CreateRatingMutationData> => {
    const created = await mutation.mutateAsync(variables.input);
    return { createRating: created };
  };

  return [createRating, { loading: mutation.isPending }];
};
