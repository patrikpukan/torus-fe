import { useQuery, useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import { CALENDAR_EVENTS_QUERY } from "./useCalendarEvents";

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

export const GOOGLE_CALENDAR_LIST_QUERY = graphql(`
  query GetGoogleCalendarList($accessToken: String) {
    googleCalendarList(accessToken: $accessToken) {
      id
      summary
      backgroundColor
      foregroundColor
      primary
    }
  }
`);

export const IMPORT_GOOGLE_CALENDAR_EVENTS_MUTATION = graphql(`
  mutation ImportGoogleCalendarEvents(
    $input: ImportGoogleCalendarEventsInput!
  ) {
    importGoogleCalendarEvents(input: $input) {
      success
      importedCount
      message
    }
  }
`);

/**
 * Hook to fetch the user's Google Calendar list
 */
export const useGoogleCalendarList = (accessToken?: string | null) => {
  return useQuery<GoogleCalendarListQueryData>(GOOGLE_CALENDAR_LIST_QUERY, {
    variables: accessToken ? { accessToken } : undefined,
    fetchPolicy: "network-only", // Always fetch fresh data
    skip: !accessToken, // Don't run query if no token
  });
};

/**
 * Hook to import events from Google Calendar
 */
export const useImportGoogleCalendar = () => {
  return useMutation<
    ImportGoogleCalendarEventsData,
    {
      input: {
        calendarIds: string[];
        startDate: string;
        endDate: string;
        accessToken?: string;
      };
    }
  >(IMPORT_GOOGLE_CALENDAR_EVENTS_MUTATION, {
    refetchQueries: [{ query: CALENDAR_EVENTS_QUERY }],
  });
};
