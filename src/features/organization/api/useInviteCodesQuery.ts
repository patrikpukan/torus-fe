import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export interface InviteCode {
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

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/organizations/invite-codes (org_admin|super_admin). Preserves the
 * react-query return shape and the `InviteCode[]` data so InviteManagementPage
 * / InviteHistoryTable keep working unchanged.
 */
export const useInviteCodesQuery = () => {
  return useQuery({
    queryKey: ["inviteCodes"],
    queryFn: () =>
      apiGet<InviteCode[]>("/organizations/invite-codes"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
