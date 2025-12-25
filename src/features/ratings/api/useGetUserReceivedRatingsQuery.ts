import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ReceivedRating = {
  id: string;
  stars: number;
  feedback?: string | null;
  createdAt: string;
  userId: string;
  meetingEvent: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    userAId: string;
    userBId: string;
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
        }
        userId
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
