import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "@/lib/supabaseClient";

export const useUpdatePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      try {
        await supabaseClient.auth.signOut();
      } catch {
        // Ignore sign-out errors to keep redirect snappy.
      }

      navigate("/login", {
        replace: true,
        state: { passwordResetSuccess: true },
      });
    },
  });
};
