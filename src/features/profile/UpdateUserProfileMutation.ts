import { graphql } from "gql.tada";

export const UPDATE_USER_PROFILE = graphql(`
  mutation UpdateUserProfile($input: UpdateCurrentUserProfileInputType!) {
    updateCurrentUserProfile(input: $input) {
      id
      email
      firstName
      lastName
      about
      hobbies
      interests
      preferredActivity
      profileImageUrl
      profileStatus
      isActive
    }
  }
`);
