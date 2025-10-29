import { gql } from "@apollo/client";

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateCurrentUserProfileInputType!) {
    updateCurrentUserProfile(input: $input) {
      id
      email
      username
      firstName
      lastName
      about
      hobbies
      preferredActivity
      interests
      profileImageUrl
      displayUsername
      profileStatus
      isActive
    }
  }
`;
