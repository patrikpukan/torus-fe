import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type UnratedMeeting = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  userA: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  userB: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  userAId: string;
  userBId: string;
};

export type UnratedMeetingsQueryData = {
  unratedMeetings: UnratedMeeting[];
};

export const UNRATED_MEETINGS_QUERY = graphql(`
  query UnratedMeetings {
    unratedMeetings {
      id
      startDateTime
      endDateTime
      userAId
      userBId
      userA {
        id
        firstName
        lastName
      }
      userB {
        id
        firstName
        lastName
      }
    }
  }
`);

export const useUnratedMeetingsQuery = () =>
  useQuery<UnratedMeetingsQueryData>(UNRATED_MEETINGS_QUERY, {
    pollInterval: 30000, // Poll every 30 seconds for new unrated meetings
    fetchPolicy: "cache-and-network",
  });
