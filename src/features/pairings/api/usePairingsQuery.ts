import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  PAIRING_HISTORY_QUERY_KEY,
  fetchPairingHistory,
} from "./pairingsQuery";
import type { PairingContact } from "@/features/pairings/types";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook to fetch the user's pairing history (REST GET /api/users/pairing-history).
 * Transforms the data into PairingContact format for use in PairingsView.
 * Sorts by latest pairing date.
 */
export const usePairingsQuery = () => {
  const { user, currentUserData } = useAuth();
  const {
    data: pairings,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: PAIRING_HISTORY_QUERY_KEY,
    queryFn: fetchPairingHistory,
    enabled: !!user, // Don't fetch if user not authenticated
  });

  // Transform pairing-history data into PairingContact format
  const pairingContacts = useMemo(() => {
    if (!pairings || !user) return [];

    return pairings.map((pairing) => {
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
  }, [pairings, user, currentUserData]);

  return {
    pairingContacts,
    loading,
    error,
    pairings: pairings ?? [],
  };
};
