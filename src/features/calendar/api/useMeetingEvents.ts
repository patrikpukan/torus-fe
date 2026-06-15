import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiGet, apiSend } from "@/lib/restClient";

export type MeetingEventItem = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  userAId: string;
  userBId: string;
  userAConfirmationStatus: string;
  userBConfirmationStatus: string;
  userAProposedStartDateTime?: string | null;
  userAProposedEndDateTime?: string | null;
  userBProposedStartDateTime?: string | null;
  userBProposedEndDateTime?: string | null;
  userANote?: string | null;
  userBNote?: string | null;
  pairingId?: string | null;
  createdAt: string;
  cancelledAt?: string | null;
  createdByUserId: string;
};

export type MeetingEventsQueryData = {
  meetingEventsByDateRange: MeetingEventItem[];
};

export type UpcomingMeetingsQueryData = {
  upcomingMeetings: MeetingEventItem[];
};

export type PendingConfirmationsQueryData = {
  pendingMeetingConfirmations: MeetingEventItem[];
};

export type LatestMeetingForPairingQueryData = {
  latestMeetingForPairing: MeetingEventItem | null;
};

export type AllMeetingsForPairingQueryData = {
  allMeetingsForPairing: MeetingEventItem[];
};

/**
 * Stable react-query key roots. Exported under the historic gql constant names
 * (e.g. MEETING_EVENTS_QUERY, LATEST_MEETING_FOR_PAIRING_QUERY) so existing
 * imports keep resolving; they are now key prefixes used for invalidation
 * instead of Apollo gql documents. Migrated from Apollo to react-query
 * (GraphQL -> REST strangler).
 */
export const MEETING_EVENTS_QUERY = "meeting-events" as const;
export const UPCOMING_MEETINGS_QUERY = "upcoming-meetings" as const;
export const PENDING_CONFIRMATIONS_QUERY = "pending-confirmations" as const;
export const LATEST_MEETING_FOR_PAIRING_QUERY =
  "latest-meeting-for-pairing" as const;
export const ALL_MEETINGS_FOR_PAIRING_QUERY =
  "all-meetings-for-pairing" as const;

export const meetingEventsKey = (startDate: string, endDate: string) =>
  [MEETING_EVENTS_QUERY, "range", startDate, endDate] as const;
export const upcomingMeetingsKey = () => [UPCOMING_MEETINGS_QUERY] as const;
export const pendingConfirmationsKey = () =>
  [PENDING_CONFIRMATIONS_QUERY] as const;
export const latestMeetingForPairingKey = (pairingId: string) =>
  [LATEST_MEETING_FOR_PAIRING_QUERY, pairingId] as const;
export const allMeetingsForPairingKey = (pairingId: string) =>
  [ALL_MEETINGS_FOR_PAIRING_QUERY, pairingId] as const;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * GET /api/meeting-events?start=&end=. Preserves the Apollo return shape
 * `{ data: { meetingEventsByDateRange }, loading, error, refetch }`.
 */
export const useMeetingEvents = (startDate: string, endDate: string) => {
  const query = useQuery({
    queryKey: meetingEventsKey(startDate, endDate),
    queryFn: () =>
      apiGet<MeetingEventItem[]>("/meeting-events", {
        start: startDate,
        end: endDate,
      }),
  });

  return {
    ...query,
    data: query.data ? { meetingEventsByDateRange: query.data } : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

/**
 * GET /api/meeting-events/upcoming. Preserves the Apollo return shape
 * `{ data: { upcomingMeetings }, loading, error, refetch }`.
 */
export const useUpcomingMeetings = () => {
  const query = useQuery({
    queryKey: upcomingMeetingsKey(),
    queryFn: () => apiGet<MeetingEventItem[]>("/meeting-events/upcoming"),
  });

  return {
    ...query,
    data: query.data ? { upcomingMeetings: query.data } : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

/**
 * GET /api/meeting-events/pending-confirmations. Preserves the Apollo return
 * shape `{ data: { pendingMeetingConfirmations }, loading, error, refetch }`.
 */
export const usePendingConfirmations = () => {
  const query = useQuery({
    queryKey: pendingConfirmationsKey(),
    queryFn: () =>
      apiGet<MeetingEventItem[]>("/meeting-events/pending-confirmations"),
  });

  return {
    ...query,
    data: query.data
      ? { pendingMeetingConfirmations: query.data }
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

/**
 * GET /api/meeting-events/pairing/:pairingId/latest. Skips when no pairingId.
 * Preserves the Apollo return shape
 * `{ data: { latestMeetingForPairing }, loading, error, refetch }`.
 */
export const useLatestMeetingForPairing = (pairingId?: string) => {
  const query = useQuery({
    queryKey: latestMeetingForPairingKey(pairingId ?? ""),
    queryFn: () =>
      apiGet<MeetingEventItem | null>(
        `/meeting-events/pairing/${pairingId}/latest`
      ),
    enabled: !!pairingId,
  });

  return {
    ...query,
    data: query.data !== undefined
      ? { latestMeetingForPairing: query.data }
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

/**
 * GET /api/meeting-events/pairing/:pairingId/all. Skips when no pairingId.
 * Preserves the shape `{ data: { allMeetingsForPairing }, ... }`. Replaces the
 * inline Apollo query previously embedded in ReadOnlyUserCalendar.
 */
export const useAllMeetingsForPairing = (pairingId?: string) => {
  const query = useQuery({
    queryKey: allMeetingsForPairingKey(pairingId ?? ""),
    queryFn: () =>
      apiGet<MeetingEventItem[]>(`/meeting-events/pairing/${pairingId}/all`),
    enabled: !!pairingId,
  });

  return {
    ...query,
    data: query.data ? { allMeetingsForPairing: query.data } : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/** Retained export names (now plain identifiers for backwards-compatible imports). */
export const CONFIRM_MEETING_MUTATION = "confirm-meeting" as const;
export const REJECT_MEETING_MUTATION = "reject-meeting" as const;
export const CREATE_MEETING_MUTATION = "create-meeting" as const;
export const PROPOSE_MEETING_TIME_MUTATION = "propose-meeting-time" as const;
export const UPDATE_MEETING_TO_PROPOSED_TIME =
  "update-meeting-to-proposed-time" as const;
export const CANCEL_MEETING_MUTATION = "cancel-meeting" as const;

type ConfirmRejectVariables = { meetingId: string; note?: string };

/**
 * POST /api/meeting-events/:id/confirm. Preserves the Apollo tuple shape
 * `[mutate, { loading }]` with `mutate({ variables: { meetingId, note } })`.
 * Invalidates pending confirmations and upcoming meetings on success.
 */
export const useConfirmMeetingMutation = (): [
  (args: { variables: ConfirmRejectVariables }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ meetingId, note }: ConfirmRejectVariables) =>
      apiSend<MeetingEventItem>(
        "POST",
        `/meeting-events/${meetingId}/confirm`,
        { note }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PENDING_CONFIRMATIONS_QUERY] });
      queryClient.invalidateQueries({ queryKey: [UPCOMING_MEETINGS_QUERY] });
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
    },
  });

  const mutate = ({ variables }: { variables: ConfirmRejectVariables }) =>
    mutation.mutateAsync(variables);

  return [mutate, { loading: mutation.isPending }];
};

/**
 * POST /api/meeting-events/:id/reject. Preserves the Apollo tuple shape.
 * Invalidates pending confirmations (and latest-for-pairing) on success.
 */
export const useRejectMeetingMutation = (): [
  (args: { variables: ConfirmRejectVariables }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ meetingId, note }: ConfirmRejectVariables) =>
      apiSend<MeetingEventItem>(
        "POST",
        `/meeting-events/${meetingId}/reject`,
        { note }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PENDING_CONFIRMATIONS_QUERY] });
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
    },
  });

  const mutate = ({ variables }: { variables: ConfirmRejectVariables }) =>
    mutation.mutateAsync(variables);

  return [mutate, { loading: mutation.isPending }];
};

export type CreateMeetingEventInput = {
  pairingId?: string | null;
  userAId: string;
  userBId: string;
  createdByUserId: string;
  startDateTime: string;
  endDateTime: string;
  note?: string | null;
};

/**
 * POST /api/meeting-events. Preserves the Apollo tuple shape
 * `[mutate, { loading }]` with `mutate({ variables: { input } })`. Invalidates
 * upcoming meetings and latest-for-pairing on success.
 */
export const useCreateMeetingMutation = (): [
  (args: {
    variables: { input: CreateMeetingEventInput };
  }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateMeetingEventInput) =>
      apiSend<MeetingEventItem>("POST", "/meeting-events", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UPCOMING_MEETINGS_QUERY] });
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
    },
  });

  const mutate = ({
    variables,
  }: {
    variables: { input: CreateMeetingEventInput };
  }) => mutation.mutateAsync(variables.input);

  return [mutate, { loading: mutation.isPending }];
};

export type ProposeMeetingTimeInput = {
  meetingId: string;
  userId: string;
  status: string;
  proposedStartDateTime?: string | null;
  proposedEndDateTime?: string | null;
  note?: string | null;
};

/**
 * POST /api/meeting-events/:id/propose-time. Preserves the Apollo tuple shape
 * `[mutate, { loading }]` with `mutate({ variables: { input } })`. Invalidates
 * latest-for-pairing and pending confirmations on success.
 */
export const useProposeMeetingTimeMutation = (): [
  (args: {
    variables: { input: ProposeMeetingTimeInput };
  }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ meetingId, ...body }: ProposeMeetingTimeInput) =>
      apiSend<MeetingEventItem>(
        "POST",
        `/meeting-events/${meetingId}/propose-time`,
        body
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
      queryClient.invalidateQueries({ queryKey: [PENDING_CONFIRMATIONS_QUERY] });
    },
  });

  const mutate = ({
    variables,
  }: {
    variables: { input: ProposeMeetingTimeInput };
  }) => mutation.mutateAsync(variables.input);

  return [mutate, { loading: mutation.isPending }];
};

/**
 * POST /api/meeting-events/:id/update-to-proposed (accept proposed time).
 * Preserves the Apollo tuple shape `[mutate, { loading }]` with
 * `mutate({ variables: { meetingId } })`. Invalidates latest-for-pairing and
 * upcoming meetings on success.
 */
export const useAcceptProposedTimeMutation = (): [
  (args: {
    variables: { meetingId: string };
  }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ meetingId }: { meetingId: string }) =>
      apiSend<MeetingEventItem>(
        "POST",
        `/meeting-events/${meetingId}/update-to-proposed`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
      queryClient.invalidateQueries({ queryKey: [UPCOMING_MEETINGS_QUERY] });
    },
  });

  const mutate = ({ variables }: { variables: { meetingId: string } }) =>
    mutation.mutateAsync(variables);

  return [mutate, { loading: mutation.isPending }];
};

export type CancelMeetingEventInput = {
  meetingId: string;
  cancelledByUserId: string;
  reason?: string | null;
};

/**
 * POST /api/meeting-events/:id/cancel. Preserves the Apollo tuple shape
 * `[mutate, { loading }]` with `mutate({ variables: { input } })`. Invalidates
 * latest-for-pairing and upcoming meetings on success.
 */
export const useCancelMeetingMutation = (): [
  (args: {
    variables: { input: CancelMeetingEventInput };
  }) => Promise<MeetingEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ meetingId, ...body }: CancelMeetingEventInput) =>
      apiSend<MeetingEventItem>(
        "POST",
        `/meeting-events/${meetingId}/cancel`,
        body
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LATEST_MEETING_FOR_PAIRING_QUERY],
      });
      queryClient.invalidateQueries({ queryKey: [UPCOMING_MEETINGS_QUERY] });
    },
  });

  const mutate = ({
    variables,
  }: {
    variables: { input: CancelMeetingEventInput };
  }) => mutation.mutateAsync(variables.input);

  return [mutate, { loading: mutation.isPending }];
};
