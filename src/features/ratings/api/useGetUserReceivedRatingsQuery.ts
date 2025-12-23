import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ReceivedRating = {
  id: string;
  stars: number;
  feedback?: string | null;
  createdAt: string;
  meetingEvent: {
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
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
};

export type UserReceivedRatingsData = {
  getUserReceivedRatings: {
    userId: string;
    averageRating?: number | null;
    totalRatings: number;
    ratings: ReceivedRating[];
  } | null;
};

export const GET_USER_RECEIVED_RATINGS_QUERY = graphql(`
  query GetUserReceivedRatings($userId: ID!) {
    getUserReceivedRatings(userId: $userId) {
      userId
      averageRating
      totalRatings
      ratings {
        id
        stars
        feedback
        createdAt
        meetingEvent {
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
        user {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`);

export const useGetUserReceivedRatingsQuery = (userId?: string) =>
  useQuery<UserReceivedRatingsData>(GET_USER_RECEIVED_RATINGS_QUERY, {
    skip: !userId,
    variables: { userId: userId ?? "" },
    fetchPolicy: "cache-and-network",
  });
