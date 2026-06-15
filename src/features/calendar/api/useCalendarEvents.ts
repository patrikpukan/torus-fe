import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiGet, apiSend } from "@/lib/restClient";

export type CalendarEventItem = {
  id: string;
  title?: string | null;
  description?: string | null;
  type: string;
  startDateTime: string;
  endDateTime: string;
  rrule?: string | null;
  exceptionDates?: string | null;
  exceptionRrules?: string | null;
  externalId?: string | null;
  externalSource?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CalendarOccurrenceItem = {
  id: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  originalEvent: CalendarEventItem;
};

export type CalendarEventsQueryData = {
  expandedCalendarOccurrences: CalendarOccurrenceItem[];
};

/**
 * Stable query-key root for calendar occurrences. Exported under the historic
 * `CALENDAR_EVENTS_QUERY` name so existing imports (CalendarEventForm,
 * useEditEventForm, DeleteEventModal) keep resolving; it is now a react-query
 * key prefix used for invalidation instead of an Apollo gql document.
 */
export const CALENDAR_EVENTS_QUERY = "calendar-events" as const;

export const calendarEventsKey = (startDate: string, endDate: string) =>
  [CALENDAR_EVENTS_QUERY, "occurrences", startDate, endDate] as const;

export const calendarEventsForUserKey = (
  userId: string,
  startDate: string,
  endDate: string
) =>
  [
    CALENDAR_EVENTS_QUERY,
    "occurrences",
    "user",
    userId,
    startDate,
    endDate,
  ] as const;

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/calendar-events/occurrences?start=&end=. Preserves the Apollo return
 * shape `{ data: { expandedCalendarOccurrences }, loading, error, refetch }` so
 * ProfileCalendar and CalendarEventList keep working unchanged.
 */
export const useCalendarEvents = (startDate: string, endDate: string) => {
  const query = useQuery({
    queryKey: calendarEventsKey(startDate, endDate),
    queryFn: () =>
      apiGet<CalendarOccurrenceItem[]>("/calendar-events/occurrences", {
        start: startDate,
        end: endDate,
      }),
  });

  return {
    ...query,
    data: query.data
      ? { expandedCalendarOccurrences: query.data }
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};

export type CreateCalendarEventInput = {
  userId: string;
  type: string;
  title?: string | null;
  description?: string | null;
  startDateTime: string;
  endDateTime: string;
  rrule?: string | null;
};

/**
 * Migrated create mutation. POST /api/calendar-events. Preserves the Apollo
 * tuple shape `[mutate, { loading }]` with `mutate({ variables: { input } })`.
 * Invalidates all calendar-event queries on success (matches the old
 * refetchQueries against CALENDAR_EVENTS_QUERY).
 */
export const useCreateCalendarEventMutation = (): [
  (args: {
    variables: { input: CreateCalendarEventInput };
  }) => Promise<CalendarEventItem>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateCalendarEventInput) =>
      apiSend<CalendarEventItem>("POST", "/calendar-events", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY] });
    },
  });

  const mutate = ({
    variables,
  }: {
    variables: { input: CreateCalendarEventInput };
  }) => mutation.mutateAsync(variables.input);

  return [mutate, { loading: mutation.isPending }];
};

export type UpdateCalendarEventInput = {
  id: string;
  title?: string;
  description?: string;
  type?: string;
  startDateTime?: string;
  endDateTime?: string;
};

type UpdateCalendarEventVariables = {
  input: UpdateCalendarEventInput;
  scope?: "this" | "following" | "all";
  occurrenceStart?: Date | string;
};

/**
 * Retained export name `UPDATE_CALENDAR_EVENT` (now a plain identifier kept for
 * backwards-compatible imports). The actual mutation runs through the hook
 * below.
 */
export const UPDATE_CALENDAR_EVENT = "update-calendar-event" as const;

/**
 * Migrated update mutation. PATCH /api/calendar-events/:id. updateCalendarEvent
 * returns an ARRAY (mirrors the resolver). Preserves the Apollo tuple shape
 * `[mutate, { loading }]` with `mutate({ variables: { input, scope,
 * occurrenceStart } })`. Invalidates calendar-event queries on success.
 */
export const useUpdateCalendarEventMutation = (): [
  (args: {
    variables: UpdateCalendarEventVariables;
  }) => Promise<CalendarEventItem[]>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      input,
      scope,
      occurrenceStart,
    }: UpdateCalendarEventVariables) => {
      const { id, ...rest } = input;
      const body: Record<string, unknown> = { ...rest };
      if (scope) {
        body.scope = scope;
      }
      if (occurrenceStart) {
        body.occurrenceStart =
          occurrenceStart instanceof Date
            ? occurrenceStart.toISOString()
            : occurrenceStart;
      }
      return apiSend<CalendarEventItem[]>(
        "PATCH",
        `/calendar-events/${id}`,
        body
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY] });
    },
  });

  const mutate = ({ variables }: { variables: UpdateCalendarEventVariables }) =>
    mutation.mutateAsync(variables);

  return [mutate, { loading: mutation.isPending }];
};

export type DeleteCalendarEventInput = {
  id: string;
  scope?: "this" | "following" | "all";
  occurrenceStart?: Date | string;
};

/**
 * Retained export name `DELETE_CALENDAR_EVENT` (now a plain identifier kept for
 * backwards-compatible imports). The actual mutation runs through the hook
 * below.
 */
export const DELETE_CALENDAR_EVENT = "delete-calendar-event" as const;

/**
 * Migrated delete mutation. DELETE /api/calendar-events/:id. Preserves the
 * Apollo tuple shape `[mutate, { loading }]` with `mutate({ variables: {
 * input } })`. Invalidates calendar-event queries on success.
 */
export const useDeleteCalendarEventMutation = (): [
  (args: {
    variables: { input: DeleteCalendarEventInput };
  }) => Promise<boolean>,
  { loading: boolean },
] => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, scope, occurrenceStart }: DeleteCalendarEventInput) => {
      const body: Record<string, unknown> = {};
      if (scope) {
        body.scope = scope;
      }
      if (occurrenceStart) {
        body.occurrenceStart =
          occurrenceStart instanceof Date
            ? occurrenceStart.toISOString()
            : occurrenceStart;
      }
      return apiSend<boolean>("DELETE", `/calendar-events/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CALENDAR_EVENTS_QUERY] });
    },
  });

  const mutate = ({
    variables,
  }: {
    variables: { input: DeleteCalendarEventInput };
  }) => mutation.mutateAsync(variables.input);

  return [mutate, { loading: mutation.isPending }];
};
