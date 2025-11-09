import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { type CalendarEventsQueryData } from "./useCalendarEvents";

/**
 * Fetch calendar events for a specific user in a given date range.
 * Uses the same query shape as the current-user calendar, but allows
 * scoping by user via per-request headers. If no userId is provided,
 * the query is skipped.
 */
const CALENDAR_EVENTS_FOR_USER_QUERY = gql`
  query GetCalendarEventsForUser(
    $userId: ID!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    expandedCalendarOccurrences(
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      occurrenceStart
      occurrenceEnd
      originalEvent {
        id
        title
        description
        type
        startDateTime
        endDateTime
        rrule
        exceptionDates
        exceptionRrules
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

export const useUserCalendarEvents = (
  userId: string | undefined,
  startDate: string,
  endDate: string
) => {
  return useQuery<CalendarEventsQueryData>(CALENDAR_EVENTS_FOR_USER_QUERY, {
    variables: { userId: userId as string, startDate, endDate },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });
};
