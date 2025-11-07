import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

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
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CalendarEventsQueryData = {
  calendarEventsByDateRange: CalendarEventItem[];
};

export const CALENDAR_EVENTS_QUERY = graphql(`
  query GetCalendarEvents($startDate: DateTime!, $endDate: DateTime!) {
    calendarEventsByDateRange(startDate: $startDate, endDate: $endDate) {
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
`);

export const UPDATE_CALENDAR_EVENT = graphql(`
  mutation UpdateCalendarEvent($input: UpdateCalendarEventInput!) {
    updateCalendarEvent(input: $input) {
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
`);

export const DELETE_CALENDAR_EVENT = graphql(`
  mutation DeleteCalendarEvent($input: DeleteCalendarEventInput!) {
    deleteCalendarEvent(input: $input)
  }
`);

export const useCalendarEvents = (startDate: string, endDate: string) => {
  return useQuery<CalendarEventsQueryData>(CALENDAR_EVENTS_QUERY, {
    variables: {
      startDate,
      endDate,
    },
    fetchPolicy: "cache-and-network",
  });
};
