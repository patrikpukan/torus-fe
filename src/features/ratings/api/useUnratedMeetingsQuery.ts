import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export type UnratedMeeting = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  userA: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  userB: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  userAId: string;
  userBId: string;
};

export type UnratedMeetingsQueryData = {
  unratedMeetings: UnratedMeeting[];
};

/** Shared react-query key so the create-rating mutation can invalidate it. */
export const UNRATED_MEETINGS_QUERY_KEY = ["ratings", "unrated-meetings"];

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler). Polls every
 * 30s (was Apollo `pollInterval: 30000`). Return shape preserves
 * `{ data: { unratedMeetings } }` so useRatingModalTrigger keeps working.
 */
export const useUnratedMeetingsQuery = () => {
  const query = useQuery({
    queryKey: UNRATED_MEETINGS_QUERY_KEY,
    queryFn: () =>
      apiGet<UnratedMeeting[]>("/ratings/unrated-meetings"),
    refetchInterval: 30000,
  });

  return {
    ...query,
    data: query.data ? { unratedMeetings: query.data } : undefined,
  };
};
