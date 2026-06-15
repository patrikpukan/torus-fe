import { apiGet } from "@/lib/restClient";
import { useQuery } from "@tanstack/react-query";

export type PeriodTrend = {
  periodId: string;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  pairingsCount: number;
  metPairingsCount: number;
  meetingCompletionRate: number;
  pairedUsersCount: number;
  activeUsersCount: number;
  participationRate: number;
  averageRating?: number | null;
  ratingsCount: number;
  didNotMeetCount: number;
};

export type StatisticsTrendsQueryData = {
  statisticsTrends: {
    trends: PeriodTrend[];
  };
};

type TrendsResponse = {
  trends: PeriodTrend[];
};

export const useStatisticsTrendsQuery = (
  organizationId?: string | null,
  limit = 8
) => {
  const params = {
    organizationId: organizationId ?? undefined,
    limit,
  };

  const query = useQuery({
    queryKey: ["statistics-trends", params],
    queryFn: () => apiGet<TrendsResponse>("/statistics/trends", params),
  });

  return {
    data: query.data
      ? { statisticsTrends: { trends: query.data.trends } }
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};
