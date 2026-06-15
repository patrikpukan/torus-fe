import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";
import type { ReportsQueryItem } from "./useReportsQuery";
import { REPORTS_QUERY } from "./useReportsQuery";
import { REPORT_BY_ID_QUERY } from "./useReportByIdQuery";

export type ResolveReportInput = {
  reportId: string;
  resolutionNote?: string | null;
};

export type ResolveReportMutationData = {
  resolveReport: {
    id: string;
    status: ReportsQueryItem["status"];
    resolvedBy?: {
      id: string;
    } | null;
  };
};

type ResolveReportApiResult = {
  id: string;
  status: ReportsQueryItem["status"];
  resolvedBy?: { id: string } | null;
};

type ResolveMutationArgs = {
  variables: { input: ResolveReportInput };
  // Accepted for call-site compatibility with the old Apollo signature;
  // invalidation is handled internally via the query client.
  refetchQueries?: unknown;
};

/**
 * Resolves a report via REST. Returns a tuple matching the Apollo
 * `useMutation` shape consumers expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to
 * `{ data: { resolveReport } }`. On success the reports list and the affected
 * report-by-id query are invalidated (replacing the old `refetchQueries`).
 */
export const useResolveReportMutation = (): [
  (args: ResolveMutationArgs) => Promise<{ data: ResolveReportMutationData }>,
  { loading: boolean }
] => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: ResolveReportInput) =>
      apiSend<ResolveReportApiResult>(
        "PATCH",
        `/reports/${encodeURIComponent(input.reportId)}/resolve`,
        { resolutionNote: input.resolutionNote ?? null }
      ),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY] });
      queryClient.invalidateQueries({
        queryKey: [REPORT_BY_ID_QUERY, { id: input.reportId }],
      });
    },
  });

  const mutate = async ({ variables }: ResolveMutationArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { resolveReport: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
