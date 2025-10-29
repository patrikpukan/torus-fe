import { graphql } from "gql.tada";

export const UPDATE_USER_PROFILE = graphql(`
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
`);
