import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { apolloClient } from "@/lib/apolloClient";

interface ValidateInviteCodeResponse {
  validateInviteCode: {
    isValid: boolean;
    message: string;
    organizationId?: string;
    organizationName?: string;
    remainingUses?: number;
  };
}

interface ValidateInviteCodeVariables {
  code: string;
}

const VALIDATE_INVITE_CODE = gql`
  query ValidateInviteCode($code: String!) {
    validateInviteCode(code: $code) {
      isValid
      message
      organizationId
      organizationName
      remainingUses
    }
  }
`;

export const useValidateInviteCodeQuery = (code: string | null) => {
  return useQuery({
    queryKey: ["validateInviteCode", code],
    queryFn: async () => {
      if (!code || code.trim().length === 0) {
        return null;
      }

      const result = await apolloClient.query<
        ValidateInviteCodeResponse,
        ValidateInviteCodeVariables
      >({
        query: VALIDATE_INVITE_CODE,
        variables: { code: code.trim() },
      });

      return result.data?.validateInviteCode ?? null;
    },
    enabled: !!code && code.trim().length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
};
