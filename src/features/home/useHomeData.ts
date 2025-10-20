import { useMemo } from "react";

import { pairingContacts } from "@/mocks/mockPairings";

type HomeStats = {
  activeSince: string | null;
  pairingsThisYear: number;
  successfulPairingsThisYear: number;
};

type UseHomeDataResult = {
  firstName: string;
  currentPairing: (typeof pairingContacts)[number] | null;
  stats: HomeStats;
  isLoading: boolean;
  isEmpty: boolean;
};

const getCurrentPairing = () => {
  if (!pairingContacts.length) {
    return null;
  }

  return [...pairingContacts].sort((a, b) => {
    return (
      new Date(b.lastPairedAt).getTime() - new Date(a.lastPairedAt).getTime()
    );
  })[0];
};

const getStats = (activeSince: string | null): HomeStats => {
  const referenceYear = new Date().getFullYear();

  const pairingsThisYear = pairingContacts.filter((contact) => {
    return new Date(contact.lastPairedAt).getFullYear() === referenceYear;
  });

  const successfulPairingsThisYear = pairingsThisYear.filter((contact) => {
    return contact.profile.pairingStatus === "Paired";
  });

  return {
    activeSince,
    pairingsThisYear: pairingsThisYear.length,
    successfulPairingsThisYear: successfulPairingsThisYear.length,
  };
};

const useHomeData = (): UseHomeDataResult => {
  //TODO mock data
  return useMemo(() => {
    const currentPairing = getCurrentPairing();
    const stats = getStats(currentPairing?.lastPairedAt ?? null);

    return {
      firstName: "Ferko",
      currentPairing,
      stats,
      isLoading: false,
      isEmpty: !currentPairing,
    };
  }, []);
};

export default useHomeData;
