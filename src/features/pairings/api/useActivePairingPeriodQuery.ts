import { apiGet } from "@/lib/restClient";
import { useQuery } from "@tanstack/react-query";

export type ActivePairingPeriod = {
  id: string;
  organizationId: string;
  startDate: string;
  endDate?: string | null;
  status: string;
};

export type ActivePairingPeriodData = {
  activePairingPeriod: ActivePairingPeriod | null;
};

/**
 * react-query key for the active pairing period. Use this with
 * `queryClient.invalidateQueries({ queryKey: ACTIVE_PAIRING_PERIOD_QUERY_KEY })`
 * to refresh after a mutation (replaces the old Apollo `refetchQueries` entry).
 */
export const ACTIVE_PAIRING_PERIOD_QUERY_KEY = ["active-pairing-period"];

export const useActivePairingPeriodQuery = () => {
  const query = useQuery({
    queryKey: ACTIVE_PAIRING_PERIOD_QUERY_KEY,
    queryFn: () =>
      apiGet<ActivePairingPeriod | null>("/pairing-periods/active"),
  });

  return {
    data: query.data
      ? { activePairingPeriod: query.data }
      : { activePairingPeriod: null },
    loading: query.isLoading,
    error: query.error ?? undefined,
  };
};
