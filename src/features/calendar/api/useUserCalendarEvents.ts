import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";
import {
  calendarEventsForUserKey,
  type CalendarEventsQueryData,
  type CalendarOccurrenceItem,
} from "./useCalendarEvents";

/**
 * Fetch calendar events for a specific user in a given date range.
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/calendar-events/occurrences?userId=&start=&end=. The backend
 * authorizes cross-user access. If no userId is provided, the query is skipped.
 * Preserves the Apollo return shape `{ data: { expandedCalendarOccurrences } }`
 * so ReadOnlyUserCalendar keeps working unchanged.
 */
export const useUserCalendarEvents = (
  userId: string | undefined,
  startDate: string,
  endDate: string
) => {
  const query = useQuery({
    queryKey: calendarEventsForUserKey(userId ?? "", startDate, endDate),
    queryFn: () =>
      apiGet<CalendarOccurrenceItem[]>("/calendar-events/occurrences", {
        userId,
        start: startDate,
        end: endDate,
      }),
    enabled: !!userId,
  });

  return {
    ...query,
    data: query.data
      ? ({ expandedCalendarOccurrences: query.data } as CalendarEventsQueryData)
      : undefined,
    loading: query.isLoading,
    error: query.error as Error | undefined,
    refetch: query.refetch,
  };
};
