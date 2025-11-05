import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";

interface CreateInviteCodeInput {
  maxUses?: number;
  expiresInHours?: number;
}

interface CreateInviteCodeResponse {
  createInviteCode: {
    success: boolean;
    message: string;
    code: string;
    inviteUrl: string;
    expiresAt?: string;
  };
}

const CREATE_INVITE_CODE = gql`
  mutation CreateInviteCode($input: CreateInviteCodeInputType) {
    createInviteCode(input: $input) {
      success
      message
      code
      inviteUrl
      expiresAt
    }
  }
`;

export const useCreateInviteCodeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input?: CreateInviteCodeInput) => {
      const { data } = await apolloClient.mutate<CreateInviteCodeResponse>({
        mutation: CREATE_INVITE_CODE,
        variables: { input },
      });
      return data?.createInviteCode;
    },
    onSuccess: () => {
      // Refetch invite codes after creating a new one
      queryClient.invalidateQueries({ queryKey: ["inviteCodes"] });
    },
  });
};
