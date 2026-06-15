import { useMutation as useApolloMutation } from "@apollo/client/react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { graphql } from "gql.tada";
import { apiGet, apiSend } from "@/lib/restClient";
import type {
  AlgorithmSettings,
  AlgorithmSettingsResponse,
  PairingExecutionResult,
  UpdateAlgorithmSettingsInput,
} from "../types";

type GetAlgorithmSettingsData = {
  getAlgorithmSettings: AlgorithmSettings;
};

type UpdateAlgorithmSettingsData = {
  updateAlgorithmSettings: AlgorithmSettingsResponse;
};

type ExecutePairingAlgorithmData = {
  executePairingAlgorithm: PairingExecutionResult;
};

type ExecutePairingAlgorithmVariables = {
  organizationId: string;
};

/**
 * React Query key for the algorithm-settings GET. Kept under the historical
 * name `GET_ALGORITHM_SETTINGS` so existing consumers (e.g. the settings form's
 * `refetchQueries`) continue to import it unchanged.
 */
export const GET_ALGORITHM_SETTINGS = "algorithmSettings" as const;

const algorithmSettingsQueryKey = (organizationId: string) =>
  [GET_ALGORITHM_SETTINGS, { organizationId }] as const;

// executePairingAlgorithm remains on GraphQL (out of scope for this migration).
export const EXECUTE_PAIRING_ALGORITHM = graphql(`
  mutation ExecutePairingAlgorithm($organizationId: String!) {
    executePairingAlgorithm(organizationId: $organizationId) {
      success
      pairingsCreated
      message
      unpairedUsers
    }
  }
`);

/**
 * Fetches algorithm settings via REST. Mirrors the Apollo `useQuery` return
 * shape used by consumers: `{ data?: { getAlgorithmSettings }, loading }`.
 */
export const useGetAlgorithmSettings = (organizationId: string) => {
  const query = useQuery({
    queryKey: algorithmSettingsQueryKey(organizationId),
    queryFn: () =>
      apiGet<AlgorithmSettings>("/algorithm-settings", { organizationId }),
    enabled: !!organizationId,
  });

  return {
    data: query.data
      ? ({ getAlgorithmSettings: query.data } as GetAlgorithmSettingsData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};

type UpdateMutationArgs = {
  variables: { input: UpdateAlgorithmSettingsInput };
  // Accepted for call-site compatibility with the old Apollo signature;
  // invalidation is handled internally via the query client.
  refetchQueries?: unknown;
};

/**
 * Updates algorithm settings via REST. Returns a tuple matching the Apollo
 * `useMutation` shape consumers expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to
 * `{ data: { updateAlgorithmSettings } }`. On success the GET query for the
 * affected org is invalidated.
 */
export const useUpdateAlgorithmSettings = (): [
  (args: UpdateMutationArgs) => Promise<{
    data: UpdateAlgorithmSettingsData;
  }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: UpdateAlgorithmSettingsInput) =>
      apiSend<AlgorithmSettingsResponse>(
        "PUT",
        "/algorithm-settings",
        input
      ),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({
        queryKey: algorithmSettingsQueryKey(input.organizationId),
      });
    },
  });

  const mutate = async ({ variables }: UpdateMutationArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { updateAlgorithmSettings: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};

export const useExecutePairingAlgorithm = () => {
  return useApolloMutation<
    ExecutePairingAlgorithmData,
    ExecutePairingAlgorithmVariables
  >(EXECUTE_PAIRING_ALGORITHM);
};
