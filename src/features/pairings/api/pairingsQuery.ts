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
  };
  userB: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
    profileStatus: string;
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
      }
      userB {
        id
        email
        firstName
        lastName
        profileImageUrl
        profileStatus
      }
    }
  }
`);
