import { graphql } from "gql.tada";

export const UPDATE_USER_PROFILE = graphql(`
  mutation UpdateUserProfile($input: UpdateCurrentUserProfileInputType!) {
    updateCurrentUserProfile(input: $input) {
      id
      email
      firstName
      lastName
      about
      location
      position
      hobbies {
        id
        name
        category
      }
      interests {
        id
        name
        category
      }
      preferredActivity
      profileImageUrl
      profileStatus
      isActive
      departmentId
      department {
        id
        name
      }
    }
  }
`);
