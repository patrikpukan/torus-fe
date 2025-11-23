import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState(
    "Finishing sign-in… please wait."
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const completeAuth = async () => {
      // Some Supabase flows deliver a `code` via query params that must be exchanged manually.
      const searchParams = new URLSearchParams(window.location.search);
      const verificationCode = searchParams.get("code");
      const isCalendarSync = searchParams.get("calendar_sync") === "true";

      if (verificationCode) {
        const { error } =
          await supabaseClient.auth.exchangeCodeForSession(verificationCode);

        if (error) {
          setHasError(true);
          setStatusMessage(error.message);
          return;
        }
      }

      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        setHasError(true);
        setStatusMessage(error.message);
        return;
      }

      if (data.session) {
        // For calendar sync, get the provider token and restore original session
        if (isCalendarSync) {
          const oauthInProgress = sessionStorage.getItem(
            "calendar_oauth_in_progress"
          );
          const originalSessionStr = sessionStorage.getItem(
            "calendar_oauth_restore_session"
          );

          if (oauthInProgress && originalSessionStr) {
            try {
              // Get the current session (which has Google OAuth)
              const {
                data: { session: currentSession },
              } = await supabaseClient.auth.getSession();

              // Get the new Google provider token from current session
              const { data: userData } = await supabaseClient.auth.getUser();

              const googleIdentity = userData.user?.identities?.find(
                (id) => id.provider === "google"
              );

              // Try to get provider token from session first, then from identity
              const providerToken =
                (currentSession as any)?.provider_token ||
                (currentSession as any)?.access_token ||
                (googleIdentity as any)?.identity_data?.provider_token ||
                (userData.user as any)?.user_metadata?.provider_token ||
                (userData.user as any)?.app_metadata?.provider_token;

              // Store the access token
              if (providerToken) {
                sessionStorage.setItem(
                  "google_calendar_access_token",
                  providerToken
                );
              } else {
                console.error("No provider token found in session");
              }

              // Restore the original session
              const originalSession = JSON.parse(originalSessionStr);
              await supabaseClient.auth.setSession({
                access_token: originalSession.access_token,
                refresh_token: originalSession.refresh_token,
              });

              // Clean up
              sessionStorage.removeItem("calendar_oauth_restore_session");
              sessionStorage.removeItem("calendar_oauth_in_progress");

              const redirectPath =
                sessionStorage.getItem("google_calendar_redirect") ||
                "/profile";
              sessionStorage.removeItem("google_calendar_redirect");

              setStatusMessage(
                "Calendar access granted! Redirecting you back…"
              );
              setTimeout(() => {
                navigate(redirectPath, { replace: true });
              }, 1000);
            } catch (err) {
              console.error("Failed to restore session:", err);
              sessionStorage.removeItem("calendar_oauth_restore_session");
              sessionStorage.removeItem("calendar_oauth_in_progress");
              setHasError(true);
              setStatusMessage("Failed to complete calendar authorization");
            }
          } else {
            // Fallback if session restoration data is missing
            const redirectPath =
              sessionStorage.getItem("google_calendar_redirect") || "/profile";
            sessionStorage.removeItem("google_calendar_redirect");
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 1000);
          }
        } else {
          setStatusMessage("Email verified! Redirecting you to the app…");
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 2000);
        }
      } else {
        setStatusMessage(
          "Email verified! You can return to the application and sign in."
        );
      }
    };

    void completeAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={
              hasError
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {statusMessage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
