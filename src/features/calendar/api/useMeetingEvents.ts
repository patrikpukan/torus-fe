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

// Latest meeting for a pairing
export type LatestMeetingForPairingQueryData = {
  latestMeetingForPairing: MeetingEventItem | null;
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

// Latest meeting for a pairing
export const LATEST_MEETING_FOR_PAIRING_QUERY = graphql(`
  query LatestMeetingForPairing($pairingId: ID!) {
    latestMeetingForPairing(pairingId: $pairingId) {
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

export const useLatestMeetingForPairing = (pairingId?: string) => {
  return useQuery<LatestMeetingForPairingQueryData>(
    LATEST_MEETING_FOR_PAIRING_QUERY,
    {
      variables: { pairingId: pairingId as string },
      skip: !pairingId,
      fetchPolicy: "cache-and-network",
    }
  );
};

// Propose different time
export const PROPOSE_MEETING_TIME_MUTATION = graphql(`
  mutation ProposeMeetingTime($input: UpdateMeetingEventConfirmationInput!) {
    proposeMeetingTime(input: $input) {
      id
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
      userANote
      userBNote
    }
  }
`);

export const useProposeMeetingTimeMutation = () => {
  const client = useApolloClient();
  return useMutation(PROPOSE_MEETING_TIME_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "latestMeetingForPairing" });
      client.cache.evict({ fieldName: "pendingMeetingConfirmations" });
    },
  });
};

// Accept proposed time
export const UPDATE_MEETING_TO_PROPOSED_TIME = graphql(`
  mutation UpdateMeetingToProposedTime($meetingId: ID!) {
    updateMeetingToProposedTime(meetingId: $meetingId) {
      id
      startDateTime
      endDateTime
      userAConfirmationStatus
      userBConfirmationStatus
      userAProposedStartDateTime
      userAProposedEndDateTime
      userBProposedStartDateTime
      userBProposedEndDateTime
    }
  }
`);

export const useAcceptProposedTimeMutation = () => {
  const client = useApolloClient();
  return useMutation(UPDATE_MEETING_TO_PROPOSED_TIME, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "latestMeetingForPairing" });
      client.cache.evict({ fieldName: "upcomingMeetings" });
    },
  });
};

// Cancel meeting
export const CANCEL_MEETING_MUTATION = graphql(`
  mutation CancelMeeting($input: CancelMeetingEventInput!) {
    cancelMeeting(input: $input) {
      id
      cancelledAt
    }
  }
`);

export const useCancelMeetingMutation = () => {
  const client = useApolloClient();
  return useMutation(CANCEL_MEETING_MUTATION, {
    onCompleted: () => {
      client.cache.evict({ fieldName: "latestMeetingForPairing" });
      client.cache.evict({ fieldName: "upcomingMeetings" });
    },
  });
};
