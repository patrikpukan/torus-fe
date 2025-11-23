import { useCallback } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export type GoogleAuthStatus =
  | { status: "not-linked"; message: string }
  | { status: "linked-no-calendar"; message: string }
  | { status: "ready"; message: string }
  | { status: "error"; message: string };

/**
 * Hook to handle Google Calendar OAuth authorization
 * Uses Supabase OAuth but preserves the original session
 */
export const useGoogleCalendarAuth = () => {
  /**
   * Request Google Calendar permission via OAuth popup
   * Gets the provider access token without changing the user's session
   */
  const requestCalendarPermission = useCallback(async (): Promise<string> => {
    // Save current session
    const {
      data: { session: originalSession },
    } = await supabaseClient.auth.getSession();

    if (!originalSession) {
      throw new Error("No active session");
    }

    // Store session to restore later
    sessionStorage.setItem(
      "calendar_oauth_restore_session",
      JSON.stringify(originalSession)
    );
    sessionStorage.setItem("calendar_oauth_in_progress", "true");
    sessionStorage.setItem(
      "google_calendar_redirect",
      window.location.pathname
    );

    // Initiate OAuth flow - this will create a new session temporarily
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?calendar_sync=true`,
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      sessionStorage.removeItem("calendar_oauth_restore_session");
      sessionStorage.removeItem("calendar_oauth_in_progress");
      throw error;
    }

    // Return empty string since we'll get the token after redirect
    return "";
  }, []);

  /**
   * Link Google account for users who signed up with email/password
   * This is now the same as requestCalendarPermission
   */
  const linkGoogleAccount = useCallback(async () => {
    return requestCalendarPermission();
  }, [requestCalendarPermission]);

  /**
   * Check if user has Google account linked and calendar permission
   * Note: With popup approach, we can't reliably check permissions beforehand
   */
  const checkGoogleAuthStatus =
    useCallback(async (): Promise<GoogleAuthStatus> => {
      // With popup OAuth, we always show the sync option
      // The popup will handle authentication
      return {
        status: "ready",
        message: "Ready to sync",
      };
    }, []);

  return {
    requestCalendarPermission,
    linkGoogleAccount,
    checkGoogleAuthStatus,
  };
};
