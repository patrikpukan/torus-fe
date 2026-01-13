import { graphql } from "gql.tada";

export type PairingQueryItem = {
  id: string;
  userAId: string;
  userBId: string;
  status:
    | "planned"
    | "matched"
    | "met"
    | "not_met"
    | "not_planned"
    | "unspecified"
    | "cancelled";
  derivedStatus?:
    | "planned"
    | "matched"
    | "met"
    | "not_met"
    | "not_planned"
    | "unspecified"
    | "cancelled";
  createdAt: string;
  userA: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
    profileStatus: string;
    about?: string | null;
    location?: string | null;
    position?: string | null;
    preferredActivity?: string | null;
    hobbies?: Array<{
      id: string;
      name: string;
      category: "HOBBY" | "INTEREST";
    }> | null;
    interests?: Array<{
      id: string;
      name: string;
      category: "HOBBY" | "INTEREST";
    }> | null;
    organization?: {
      id: string;
      name: string;
    } | null;
    departmentId?: string | null;
    department?: {
      id: string;
      name: string;
    } | null;
    organizationId?: string | null;
  };
  userB: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
    profileStatus: string;
    about?: string | null;
    location?: string | null;
    position?: string | null;
    preferredActivity?: string | null;
    hobbies?: Array<{
      id: string;
      name: string;
      category: "HOBBY" | "INTEREST";
    }> | null;
    interests?: Array<{
      id: string;
      name: string;
      category: "HOBBY" | "INTEREST";
    }> | null;
    organization?: {
      id: string;
      name: string;
    } | null;
    departmentId?: string | null;
    department?: {
      id: string;
      name: string;
    } | null;
    organizationId?: string | null;
  };
};

export type PairingsQueryData = {
  getPairingHistory: PairingQueryItem[];
};

/**
 * Query to get current user's pairing history with detailed pairing information
 * including: paired user profiles, pairing date, pairing status, and whether currently matched
 */
export const PAIRINGS_QUERY = graphql(`
  query GetPairingHistory {
    getPairingHistory {
      id
      userAId
      userBId
      status
      derivedStatus
      createdAt
      userA {
        id
        email
        firstName
        lastName
        profileImageUrl
        profileStatus
        about
        location
        position
        preferredActivity
        departmentId
        department {
          id
          name
        }
        organization {
          id
          name
        }
        organizationId
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
      userB {
        id
        email
        firstName
        lastName
        profileImageUrl
        profileStatus
        about
        location
        position
        preferredActivity
        departmentId
        department {
          id
          name
        }
        organization {
          id
          name
        }
        organizationId
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
  }
`);
