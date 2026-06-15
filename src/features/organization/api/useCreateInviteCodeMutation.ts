import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiSend } from "@/lib/restClient";

interface CreateInviteCodeInput {
  maxUses?: number;
  expiresInHours?: number;
}

interface CreateInviteCodeResult {
  success: boolean;
  message: string;
  code: string;
  inviteUrl: string;
  expiresAt?: string;
}

/**
 * Migrated from Apollo to react-query (GraphQL -> REST strangler).
 * POST /api/organizations/invite-codes (org_admin|super_admin). Preserves the
 * react-query mutation return shape and the resolved value
 * (`{ success, message, code, inviteUrl, expiresAt }`) so InviteUrlGenerator
 * and InviteQrGenerator keep working unchanged. Invalidates the invite-codes
 * list on success.
 */
export const useCreateInviteCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input?: CreateInviteCodeInput) =>
      apiSend<CreateInviteCodeResult>(
        "POST",
        "/organizations/invite-codes",
        input ?? {}
      ),
    onSuccess: () => {
      // Refetch invite codes after creating a new one
      queryClient.invalidateQueries({ queryKey: ["inviteCodes"] });
    },
  });
};
