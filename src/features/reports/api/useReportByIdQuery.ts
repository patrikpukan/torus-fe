import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";
import type { ReportUserSummary } from "./useReportsQuery";

export type ReportDetail = {
  id: string;
  createdAt: string;
  reason: string;
  status: "pending" | "resolved";
  resolvedAt?: string | null;
  reporter: ReportUserSummary;
  reportedUser: ReportUserSummary;
  resolutionNote?: string | null;
  resolvedBy?: ReportUserSummary | null;
};

export type ReportByIdQueryData = {
  reportById: ReportDetail | null;
};

export type ReportByIdQueryVariables = {
  id: string;
};

/**
 * React Query key for the report-by-id query. Kept under the historical name
 * `REPORT_BY_ID_QUERY` so existing consumers (e.g. ReportDetailPage's
 * `refetchQueries`) continue to import it unchanged.
 */
export const REPORT_BY_ID_QUERY = "reportById" as const;

export const reportByIdQueryKey = (id?: string) =>
  [REPORT_BY_ID_QUERY, { id: id ?? "" }] as const;

/**
 * Fetches a single report via REST. Mirrors the Apollo `useQuery` return shape
 * consumers expect: `{ data?: { reportById }, loading, error }`. Disabled until
 * an id is present (matching the old `skip`).
 */
export const useReportByIdQuery = (id?: string) => {
  const query = useQuery({
    queryKey: reportByIdQueryKey(id),
    queryFn: () => apiGet<ReportDetail>(`/reports/${encodeURIComponent(id!)}`),
    enabled: !!id,
  });

  return {
    data:
      query.data !== undefined
        ? ({ reportById: query.data ?? null } as ReportByIdQueryData)
        : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
