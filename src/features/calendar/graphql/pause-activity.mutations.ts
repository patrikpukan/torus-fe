import { useMutation, useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export const PAUSE_ACTIVITY_MUTATION = graphql(`
  mutation PauseActivity($input: PauseActivityInput!) {
    pauseActivity(input: $input) {
      id
      userId
      type
      title
      description
      startDateTime
      endDateTime
      createdAt
    }
  }
`);

export const RESUME_ACTIVITY_MUTATION = graphql(`
  mutation ResumeActivity {
    resumeActivity
  }
`);

export const GET_ACTIVE_PAUSE_QUERY = graphql(`
  query GetActivePause($startDate: DateTime!, $endDate: DateTime!) {
    expandedCalendarOccurrences(startDate: $startDate, endDate: $endDate) {
      id
      occurrenceStart
      occurrenceEnd
      originalEvent {
        id
        type
        title
        description
        startDateTime
        endDateTime
        deletedAt
      }
    }
  }
`);

// Type exports
export type GetActivePauseData = ReturnType<typeof GET_ACTIVE_PAUSE_QUERY>;

// Custom hooks
export const usePauseActivityMutation = () =>
  useMutation(PAUSE_ACTIVITY_MUTATION);

export const useResumeActivityMutation = () =>
  useMutation(RESUME_ACTIVITY_MUTATION);

export const useActivePauseQuery = (variables: {
  startDate: string;
  endDate: string;
}) =>
  useQuery(GET_ACTIVE_PAUSE_QUERY, {
    variables,
    pollInterval: 0, // Disable polling
    fetchPolicy: "cache-and-network", // Use cache first, then fetch latest
    notifyOnNetworkStatusChange: true,
  });
