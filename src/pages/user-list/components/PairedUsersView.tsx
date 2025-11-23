import { useMemo } from "react";

import PairedUserTable, { type PairedUserRow } from "./PairedUserTable";
import UnpairedUserGrid from "./UnpairedUserGrid";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";
import {
  useAnonUsersQuery,
  type AnonUsersQueryItem,
} from "@/features/users/api/useAnonUsersQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";
import { Users } from "lucide-react";

const PairedUsersView = () => {
  const {
    pairings,
    loading: pairingsLoading,
    error: pairingsError,
  } = usePairingsQuery();
  const {
    data: anonUsersData,
    loading: anonUsersLoading,
    error: anonUsersError,
  } = useAnonUsersQuery();
  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUserQuery();

  const currentUserId = currentUserData?.getCurrentUser?.id;

  const pairedRows = useMemo<PairedUserRow[]>(() => {
    if (!currentUserId) {
      return [];
    }

    const latestByUser = new Map<string, PairedUserRow>();

    pairings.forEach((pairing) => {
      const isUserA = pairing.userAId === currentUserId;
      const contact = isUserA ? pairing.userB : pairing.userA;

      if (!contact) {
        return;
      }

      const pairedAt = pairing.createdAt;
      const existing = latestByUser.get(contact.id);

      if (
        !existing ||
        new Date(pairedAt).getTime() > new Date(existing.pairedAt).getTime()
      ) {
        latestByUser.set(contact.id, {
          id: contact.id,
          displayName: `${contact.firstName} ${contact.lastName}`,
          email: contact.email ?? "",
          pairedAt,
          profileImageUrl: contact.profileImageUrl ?? undefined,
        });
      }
    });

    return Array.from(latestByUser.values()).sort(
      (a, b) => new Date(b.pairedAt).getTime() - new Date(a.pairedAt).getTime()
    );
  }, [currentUserId, pairings]);

  const pairedIds = useMemo(
    () => new Set(pairedRows.map((row) => row.id)),
    [pairedRows]
  );

  const usersList = anonUsersData?.anonUsers ?? null;

  const unpairedUsers = useMemo(() => {
    if (!usersList) {
      return [];
    }

    return usersList.filter((user: AnonUsersQueryItem) => {
      if (user.id === currentUserId) {
        return false;
      }
      return !pairedIds.has(user.id);
    });
  }, [currentUserId, pairedIds, usersList]);

  const combinedLoading =
    pairingsLoading || anonUsersLoading || currentUserLoading;
  const combinedError = pairingsError || anonUsersError || currentUserError;

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
            <Users aria-hidden className="h-8 w-8 text-primary" />
            <span>Paired users</span>
          </h1>
        </div>

        <PairedUserTable
          rows={pairedRows}
          loading={combinedLoading}
          errorMessage={combinedError?.message}
        />

        <UnpairedUserGrid users={unpairedUsers} />
      </div>
    </div>
  );
};

export default PairedUsersView;
