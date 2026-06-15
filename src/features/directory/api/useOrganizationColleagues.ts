import { useQuery } from "@apollo/client/react";
import { graphql } from "gql.tada";

export type ColleagueTag = {
  id: string;
  name: string;
  category: string;
};

export type OrganizationColleague = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  position: string | null;
  profileImageUrl: string | null;
  departmentName: string | null;
  hobbies: ColleagueTag[];
  interests: ColleagueTag[];
};

export type OrganizationColleaguesQueryData = {
  organizationColleagues: OrganizationColleague[];
};

export const ORGANIZATION_COLLEAGUES_QUERY = graphql(`
  query OrganizationColleagues {
    organizationColleagues {
      id
      firstName
      lastName
      role
      position
      profileImageUrl
      departmentName
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
    }
  }
`);

export const useOrganizationColleagues = () =>
  useQuery<OrganizationColleaguesQueryData>(ORGANIZATION_COLLEAGUES_QUERY, {
    fetchPolicy: "cache-and-network",
  });
