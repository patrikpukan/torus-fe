import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { PAIRINGS_QUERY, type PairingsQueryData } from "./pairingsQuery";
import type { PairingContact } from "@/mocks/mockPairings";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch user's pairing history from GraphQL backend.
 * Transforms the data into PairingContact format for use in PairingsView.
 * Sorts by latest pairing date.
 */
export const usePairingsQuery = () => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery<PairingsQueryData>(PAIRINGS_QUERY, {
    fetchPolicy: "cache-and-network",
    skip: !user, // Don't fetch if user not authenticated
  });

  // Transform GraphQL data into PairingContact format
  const pairingContacts = useMemo(() => {
    if (!data?.getPairingHistory || !user) return [];

    return data.getPairingHistory.map((pairing) => {
      // Determine which user is the "contact" (not the current user)
      const isUserA = pairing.userAId === user.id;
      const contactUser = isUserA ? pairing.userB : pairing.userA;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const effectiveStatus = (pairing as any).derivedStatus || pairing.status;

      return {
        id: contactUser.id,
        profile: {
          organization: "", // Will be filled from other sources if needed
          email: contactUser.email,
          firstName: contactUser.firstName || "",
          lastName: contactUser.lastName || "",
          accountStatus: contactUser.profileStatus,
          pairingStatus: effectiveStatus,
          about: "",
          hobbies: null,
          interests: null,
          profileImageUrl: contactUser.profileImageUrl || "",
        },
        pairedAt: pairing.createdAt,
        lastMessageAt: pairing.createdAt, // Will be updated when messages are implemented
        messages: [], // Will be populated when messages are implemented
        pairingId: pairing.id, // Store pairing ID for status reference
        pairingStatus: effectiveStatus,
        isCurrentlyMatched: effectiveStatus === "matched",
      } as PairingContact & {
        pairingId: string;
        pairingStatus: string;
        isCurrentlyMatched: boolean;
      };
    });
  }, [data?.getPairingHistory, user]);

  return {
    pairingContacts,
    loading,
    error,
    pairings: data?.getPairingHistory ?? [],
  };
};
