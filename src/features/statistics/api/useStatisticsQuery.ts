import type {
  StatisticsFilterInputType,
  StatisticsResponseType,
} from "@/graphql/generated/schema";
import { apiGet } from "@/lib/restClient";
import { useQuery } from "@tanstack/react-query";

export type StatisticsFilter = StatisticsFilterInputType;

export type StatisticsQueryData = {
  statistics: StatisticsResponseType;
};

export const useStatisticsQuery = (filter?: StatisticsFilter) => {
  const params = {
    startDate: filter?.startDate ?? undefined,
    endDate: filter?.endDate ?? undefined,
    month: filter?.month ?? undefined,
    year: filter?.year ?? undefined,
    organizationId: filter?.organizationId ?? undefined,
  };

  const query = useQuery({
    queryKey: ["statistics", params],
    queryFn: () => apiGet<StatisticsResponseType>("/statistics", params),
  });

  return {
    data: query.data ? { statistics: query.data } : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};
