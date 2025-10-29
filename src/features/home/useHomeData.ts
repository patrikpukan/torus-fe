/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";

import { useAuth } from "@/features/auth/context/UseAuth.tsx";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";
import type { PairingContact } from "@/mocks/mockPairings";

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
    return new Date(pairing.lastPairedAt).getFullYear() === referenceYear;
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

  return useMemo(() => {
    // Get the latest pairing (most recent)
    const currentPairing =
      pairingContacts.length > 0 ? pairingContacts[0] : null;

    const stats = getStats(
      pairingContacts,
      currentPairing?.lastPairedAt ?? null
    );

    return {
      firstName: authCtx.user?.user_metadata?.first_name,
      currentPairing,
      stats,
      isLoading: loading,
      isEmpty: !currentPairing,
    };
  }, [pairingContacts, loading]);
};

export default useHomeData;
