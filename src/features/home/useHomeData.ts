import { useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";
import { useActivePairingPeriodQuery } from "@/features/pairings/api/useActivePairingPeriodQuery";
import type { PairingContact } from "@/features/pairings/types";

type HomeStats = {
  activeSince: string | null;
  pairingsThisYear: number;
  successfulPairingsThisYear: number;
};

type UseHomeDataResult = {
  firstName: string;
  currentPairing: PairingContact | null;
  stats: HomeStats;
  isLoading: boolean;
  isEmpty: boolean;
};

const getStats = (
  pairings: PairingContact[],
  activeSince: string | null
): HomeStats => {
  const referenceYear = new Date().getFullYear();

  const pairingsThisYear = pairings.filter((pairing) => {
    return new Date(pairing.pairedAt).getFullYear() === referenceYear;
  });

  // Successful pairings are those with status 'met'
  const successfulPairingsThisYear = pairingsThisYear.filter((pairing) => {
    return pairing.profile.pairingStatus === "met";
  });

  return {
    activeSince,
    pairingsThisYear: pairingsThisYear.length,
    successfulPairingsThisYear: successfulPairingsThisYear.length,
  };
};

const useHomeData = (): UseHomeDataResult => {
  const authCtx = useAuth();
  const { pairingContacts, loading } = usePairingsQuery();
  const { data: activePeriodData } = useActivePairingPeriodQuery();
  const activePeriodStart =
    activePeriodData?.activePairingPeriod?.startDate ?? null;
  const firstName = authCtx.user?.user_metadata?.first_name ?? "";

  return useMemo(() => {
    // Get the latest pairing (most recent)
    const currentPairing =
      pairingContacts.length > 0 ? pairingContacts[0] : null;

    const stats = getStats(
      pairingContacts,
      activePeriodStart ?? currentPairing?.pairedAt ?? null
    );

    return {
      firstName,
      currentPairing,
      stats,
      isLoading: loading,
      isEmpty: !currentPairing,
    };
  }, [pairingContacts, loading, activePeriodStart, firstName]);
};

export default useHomeData;
