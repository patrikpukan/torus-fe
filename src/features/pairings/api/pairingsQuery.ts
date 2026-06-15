import { apiGet } from "@/lib/restClient";

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
 * Shared react-query key + fetcher for the current user's pairing history
 * (migrated GraphQL getPairingHistory -> REST GET /api/users/pairing-history,
 * which maps userA/userB through the same user mapper, so the shape matches the
 * old GraphQL document's selection set).
 */
export const PAIRING_HISTORY_QUERY_KEY = ["users", "pairing-history"];

export const fetchPairingHistory = () =>
  apiGet<PairingQueryItem[]>("/users/pairing-history");
