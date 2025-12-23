import { useMutation, useApolloClient } from "@apollo/client/react";
import { graphql } from "gql.tada";
import { UNRATED_MEETINGS_QUERY } from "./useUnratedMeetingsQuery";

export type CreateRatingMutationData = {
  createRating: {
    id: string;
    meetingEventId: string;
    stars: number;
    feedback?: string | null;
  };
};

export type CreateRatingMutationVariables = {
  input: {
    meetingEventId: string;
    stars: number;
    feedback?: string | null;
  };
};

export const CREATE_RATING_MUTATION = graphql(`
  mutation CreateRating($input: CreateRatingInputType!) {
    createRating(input: $input) {
      id
      meetingEventId
      stars
      feedback
    }
  }
`);

export const useCreateRatingMutation = () => {
  const client = useApolloClient();

  return useMutation<CreateRatingMutationData, CreateRatingMutationVariables>(
    CREATE_RATING_MUTATION,
    {
      onCompleted: () => {
        // Refetch unrated meetings to remove the one just rated
        client.refetchQueries({
          include: [UNRATED_MEETINGS_QUERY],
        });
      },
    }
  );
};
