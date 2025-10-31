import { useMemo } from "react";

import PairedUserTable, { type PairedUserRow } from "./PairedUserTable";
import UnpairedUserGrid from "./UnpairedUserGrid";
import { usePairingsQuery } from "@/features/pairings/api/usePairingsQuery";
import {
  useUsersQuery,
  type UsersQueryItem,
} from "@/features/users/api/useUsersQuery";
import { useGetCurrentUserQuery } from "@/features/auth/api/useGetCurrentUserQuery";

const buildDisplayName = (
  firstName?: string | null,
  lastName?: string | null,
  fallback?: string | null
) => {
  const name = [firstName, lastName]
    .filter((part) => part && part.trim().length > 0)
    .join(" ")
    .trim();

  return name || fallback || "Unknown user";
};

const PairedUsersView = () => {
  const {
    pairings,
    loading: pairingsLoading,
    error: pairingsError,
  } = usePairingsQuery();
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useUsersQuery();
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

      const displayName = buildDisplayName(
        contact.firstName,
        contact.lastName,
        contact.email
      );
      const pairedAt = pairing.createdAt;
      const existing = latestByUser.get(contact.id);

      if (
        !existing ||
        new Date(pairedAt).getTime() > new Date(existing.pairedAt).getTime()
      ) {
        latestByUser.set(contact.id, {
          id: contact.id,
          displayName,
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

  const usersList = usersData?.users ?? null;

  const unpairedUsers = useMemo(() => {
    if (!usersList) {
      return [];
    }

    return usersList.filter((user: UsersQueryItem) => {
      if (user.id === currentUserId) {
        return false;
      }
      return !pairedIds.has(user.id);
    });
  }, [currentUserId, pairedIds, usersList]);

  const combinedLoading = pairingsLoading || usersLoading || currentUserLoading;
  const combinedError = pairingsError || usersError || currentUserError;

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            Paired users
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
