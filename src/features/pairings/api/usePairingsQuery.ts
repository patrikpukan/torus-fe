import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { PAIRINGS_QUERY, type PairingsQueryData } from "./pairingsQuery";
import type { PairingContact } from "@/features/pairings/types";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch user's pairing history from GraphQL backend.
 * Transforms the data into PairingContact format for use in PairingsView.
 * Sorts by latest pairing date.
 */
export const usePairingsQuery = () => {
  const { user, currentUserData } = useAuth();
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
      const organizationName =
        contactUser.organization?.name ||
        currentUserData?.organization?.name ||
        "";
      const departmentId =
        contactUser.department?.id ?? contactUser.departmentId ?? null;

      return {
        id: contactUser.id,
        profile: {
          organization: organizationName,
          email: contactUser.email,
          firstName: contactUser.firstName || "",
          lastName: contactUser.lastName || "",
          accountStatus: contactUser.profileStatus,
          pairingStatus: effectiveStatus,
          about: contactUser.about || "",
          location: contactUser.location || "",
          position: contactUser.position || "",
          preferredActivity: contactUser.preferredActivity || "",
          hobbies: contactUser.hobbies ?? null,
          interests: contactUser.interests ?? null,
          profileImageUrl: contactUser.profileImageUrl || "",
          departmentId: departmentId,
          departmentName: contactUser.department?.name || undefined,
          organizationId:
            contactUser.organization?.id ?? contactUser.organizationId ?? "",
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
  }, [data?.getPairingHistory, user, currentUserData]);

  return {
    pairingContacts,
    loading,
    error,
    pairings: data?.getPairingHistory ?? [],
  };
};
