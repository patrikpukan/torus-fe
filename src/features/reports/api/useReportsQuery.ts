import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type ReportUserSummary = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export type ReportsQueryItem = {
  id: string;
  createdAt: string;
  reason: string;
  status: "pending" | "resolved";
  resolvedAt?: string | null;
  reporter: ReportUserSummary;
  reportedUser: ReportUserSummary;
};

export type ReportsQueryData = {
  reports: ReportsQueryItem[];
};

/**
 * React Query key for the reports list. Kept under the historical name
 * `REPORTS_QUERY` so existing consumers (e.g. ReportDetailPage's
 * `refetchQueries`) continue to import it unchanged.
 */
export const REPORTS_QUERY = "reports" as const;

export const reportsQueryKey = (organizationId?: string | null) =>
  [REPORTS_QUERY, { organizationId: organizationId ?? null }] as const;

/**
 * Fetches reports via REST. Mirrors the Apollo `useQuery` return shape
 * consumers expect: `{ data?: { reports }, loading, error }`.
 */
export const useReportsQuery = (organizationId?: string | null) => {
  const query = useQuery({
    queryKey: reportsQueryKey(organizationId),
    queryFn: () =>
      apiGet<ReportsQueryItem[]>(
        "/reports",
        organizationId ? { organizationId } : undefined
      ),
  });

  return {
    data: query.data
      ? ({ reports: query.data } as ReportsQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};
