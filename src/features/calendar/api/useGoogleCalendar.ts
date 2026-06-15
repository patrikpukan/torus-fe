import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiSend } from "@/lib/restClient";

export type GoogleCalendar = {
  id: string;
  summary: string;
  backgroundColor?: string | null;
  foregroundColor?: string | null;
  primary?: boolean | null;
};

export type GoogleCalendarListQueryData = {
  googleCalendarList: GoogleCalendar[];
};

export type GoogleCalendarImportResult = {
  success: boolean;
  importedCount: number;
  message: string;
};

export type ImportGoogleCalendarEventsData = {
  importGoogleCalendarEvents: GoogleCalendarImportResult;
};

export type ImportGoogleCalendarEventsInput = {
  calendarIds: string[];
  startDate: string;
  endDate: string;
  accessToken?: string;
};

/**
 * React Query key for the Google Calendar list. Parameterized by access token
 * so a token change refetches.
 */
export const GOOGLE_CALENDAR_LIST_QUERY = "googleCalendarList" as const;

const googleCalendarListQueryKey = (accessToken?: string | null) =>
  [GOOGLE_CALENDAR_LIST_QUERY, { accessToken: accessToken ?? null }] as const;

/**
 * Fetches the user's Google Calendar list via REST. Mirrors the Apollo
 * `useQuery` return shape consumers expect:
 * `{ data?: { googleCalendarList }, loading, error, refetch }`. The query is
 * disabled until an access token is present (matching the old `skip`).
 */
export const useGoogleCalendarList = (accessToken?: string | null) => {
  const query = useQuery({
    queryKey: googleCalendarListQueryKey(accessToken),
    queryFn: () =>
      apiGet<GoogleCalendar[]>(
        "/google-calendar/calendars",
        accessToken ? { accessToken } : undefined
      ),
    enabled: !!accessToken,
  });

  return {
    data: query.data
      ? ({ googleCalendarList: query.data } as GoogleCalendarListQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error ?? undefined,
    refetch: query.refetch,
  };
};

type ImportMutationArgs = {
  variables: { input: ImportGoogleCalendarEventsInput };
};

/**
 * Imports events from Google Calendar via REST. Returns a tuple matching the
 * Apollo `useMutation` shape consumers expect: `[mutateFn, { loading }]`, where
 * `mutateFn({ variables: { input } })` resolves to
 * `{ data: { importGoogleCalendarEvents } }`. The calendar refresh after a
 * successful import is driven by the consumer's `onSyncSuccess` callback (the
 * calendar-events query lives in the Apollo cache), mirroring prior behavior.
 */
export const useImportGoogleCalendar = (): [
  (args: ImportMutationArgs) => Promise<{
    data: ImportGoogleCalendarEventsData;
  }>,
  { loading: boolean }
] => {
  const mutation = useMutation({
    mutationFn: (input: ImportGoogleCalendarEventsInput) =>
      apiSend<GoogleCalendarImportResult>(
        "POST",
        "/google-calendar/import",
        input
      ),
  });

  const mutate = async ({ variables }: ImportMutationArgs) => {
    const result = await mutation.mutateAsync(variables.input);
    return { data: { importGoogleCalendarEvents: result } };
  };

  return [mutate, { loading: mutation.isPending }];
};
