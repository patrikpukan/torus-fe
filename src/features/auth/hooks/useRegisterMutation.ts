import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "@/lib/supabaseClient";
import { appUrl } from "@/lib/appUrl";

type RegisterInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  inviteCode?: string;
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
      inviteCode,
    }: RegisterInput) => {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback`,
          data: {
            first_name: firstName || undefined,
            last_name: lastName || undefined,
            invite_code: inviteCode || undefined,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  });
