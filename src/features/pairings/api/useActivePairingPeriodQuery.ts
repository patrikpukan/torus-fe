import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ActivePairingPeriodData = {
  activePairingPeriod: {
    id: string;
    organizationId: string;
    startDate: string;
    endDate?: string | null;
    status: string;
  } | null;
};

export const ACTIVE_PAIRING_PERIOD_QUERY = graphql(`
  query ActivePairingPeriod {
    activePairingPeriod {
      id
      organizationId
      startDate
      endDate
      status
    }
  }
`);

export const useActivePairingPeriodQuery = () =>
  useQuery<ActivePairingPeriodData>(ACTIVE_PAIRING_PERIOD_QUERY, {
    fetchPolicy: "cache-and-network",
  });
