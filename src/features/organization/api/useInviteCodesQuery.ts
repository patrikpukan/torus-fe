import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";

interface InviteCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt?: string;
  usedCount: number;
  maxUses?: number;
  isActive: boolean;
  createdBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  inviteUrl: string;
}

interface GetOrganizationInvitesResponse {
  getOrganizationInvites: InviteCode[];
}

const GET_ORGANIZATION_INVITES = gql`
  query GetOrganizationInvites {
    getOrganizationInvites {
      id
      code
      createdAt
      expiresAt
      usedCount
      maxUses
      isActive
      createdBy {
        id
        email
        firstName
        lastName
      }
      inviteUrl
    }
  }
`;

export const useInviteCodesQuery = () => {
  return useQuery({
    queryKey: ["inviteCodes"],
    queryFn: async () => {
      const { data } = await apolloClient.query<GetOrganizationInvitesResponse>(
        {
          query: GET_ORGANIZATION_INVITES,
        }
      );
      return data?.getOrganizationInvites || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
