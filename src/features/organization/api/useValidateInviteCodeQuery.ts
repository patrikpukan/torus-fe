import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/restClient";

export interface ValidateInviteCodeResult {
  isValid: boolean;
  message: string;
  organizationId?: string;
  organizationName?: string;
  remainingUses?: number;
}

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * GET /api/organizations/invite-codes/validate?code= — PUBLIC. Works WITHOUT a
 * session: restClient.apiGet only attaches a bearer token when a Supabase
 * session exists and does not throw when there is none, so RegisterForm can
 * validate invite codes before the user is authenticated.
 *
 * Preserves the prior react-query return shape and the `null` sentinel for an
 * empty/blank code so RegisterForm (`inviteValidation?.isValid`,
 * `inviteValidation !== null`) keeps working unchanged.
 */
export const useValidateInviteCodeQuery = (code: string | null) => {
  return useQuery({
    queryKey: ["validateInviteCode", code],
    queryFn: async () => {
      if (!code || code.trim().length === 0) {
        return null;
      }
      return apiGet<ValidateInviteCodeResult>(
        "/organizations/invite-codes/validate",
        { code: code.trim() }
      );
    },
    enabled: !!code && code.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
