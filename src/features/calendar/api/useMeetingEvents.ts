import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { graphql } from "gql.tada";

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

export const MEETING_EVENTS_QUERY = graphql(`
  query GetMeetingEvents($startDate: DateTime!, $endDate: DateTime!) {
    meetingEventsByDateRange(startDate: $startDate, endDate: $endDate) {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
      pairingId
      createdAt
      cancelledAt
      createdByUserId
    }
  }
`);

export const UPCOMING_MEETINGS_QUERY = graphql(`
  query GetUpcomingMeetings {
    upcomingMeetings {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
      pairingId
      createdAt
      cancelledAt
      createdByUserId
    }
  }
`);

export const PENDING_CONFIRMATIONS_QUERY = graphql(`
  query GetPendingConfirmations {
    pendingMeetingConfirmations {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
      pairingId
      createdAt
      cancelledAt
      createdByUserId
    }
  }
`);

export const useMeetingEvents = (startDate: string, endDate: string) => {
  return useQuery<MeetingEventsQueryData>(MEETING_EVENTS_QUERY, {
    variables: {
      startDate,
      endDate,
    },
    fetchPolicy: "cache-and-network",
  });
};

export const useUpcomingMeetings = () => {
  return useQuery<UpcomingMeetingsQueryData>(UPCOMING_MEETINGS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
};

export const usePendingConfirmations = () => {
  return useQuery<PendingConfirmationsQueryData>(PENDING_CONFIRMATIONS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
};

// Mutations
export const CONFIRM_MEETING_MUTATION = graphql(`
  mutation ConfirmMeeting($meetingId: ID!, $note: String) {
    confirmMeeting(meetingId: $meetingId, note: $note) {
      id
      userAConfirmationStatus
      userBConfirmationStatus
      userANote
      userBNote
    }
  }
`);

export const useConfirmMeetingMutation = () => {
  const client = useApolloClient();

  return useMutation(CONFIRM_MEETING_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "pendingMeetingConfirmations" });
      client.cache.evict({ fieldName: "upcomingMeetings" });
    },
  });
};

export const REJECT_MEETING_MUTATION = graphql(`
  mutation RejectMeeting($meetingId: ID!, $note: String) {
    rejectMeeting(meetingId: $meetingId, note: $note) {
      id
      userAConfirmationStatus
      userBConfirmationStatus
      userANote
      userBNote
    }
  }
`);

export const useRejectMeetingMutation = () => {
  const client = useApolloClient();

  return useMutation(REJECT_MEETING_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "pendingMeetingConfirmations" });
    },
  });
};

export const CREATE_MEETING_MUTATION = graphql(`
  mutation CreateMeeting($input: CreateMeetingEventInput!) {
    createMeetingEvent(input: $input) {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userAConfirmationStatus
      userBConfirmationStatus
      pairingId
      createdAt
      createdByUserId
    }
  }
`);

export const useCreateMeetingMutation = () => {
  const client = useApolloClient();

  return useMutation(CREATE_MEETING_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "upcomingMeetings" });
    },
  });
};
