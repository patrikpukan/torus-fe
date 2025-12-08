import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { supabaseClient } from "@/lib/supabaseClient";

export type ResetSessionStatus = "checking" | "ready" | "error";

export const useResetPasswordSession = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<ResetSessionStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const hydrateSession = async () => {
      setStatus("checking");
      setErrorMessage(null);

      try {
        if (code) {
          const { error: exchangeError } =
            await supabaseClient.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw new Error(exchangeError.message);
          }
        }

        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
        const hashType = hashParams.get("type");
        const hashAccessToken = hashParams.get("access_token");

        if (hashType && hashAccessToken) {
          await supabaseClient.auth.getSession();
        }

        const { data, error: sessionError } =
          await supabaseClient.auth.getSession();

        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!data.session) {
          throw new Error(
            "Could not find an active reset session. Please request a new password reset email."
          );
        }

        if (active) {
          setStatus("ready");
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while preparing your password reset link.";

        if (active) {
          setErrorMessage(message);
          setStatus("error");
        }
      }
    };

    void hydrateSession();

    return () => {
      active = false;
    };
  }, [code, location.hash]);

  return { status, errorMessage };
};
