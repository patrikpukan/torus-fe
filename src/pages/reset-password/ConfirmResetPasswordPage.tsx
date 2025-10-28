import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabaseClient";

const ConfirmResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "pending" | "ready" | "error" | "success"
  >("pending");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordMismatch = useMemo(
    () => newPassword !== confirmPassword && confirmPassword.length > 0,
    [newPassword, confirmPassword]
  );

  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hasType = params.get("type");
      const hasAccessToken = params.get("access_token");

      // Supabase automatically parses hash fragments on load, but in case
      // the link uses ?code=, exchange it here.
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabaseClient.auth.exchangeCodeForSession(code);
        if (!isMounted) {
          return;
        }
        if (exchangeError) {
          setStatus("error");
          setError(exchangeError.message);
          return;
        }
      }

      // Wait for Supabase to pick up auth hash if present
      if (hasType && hasAccessToken) {
        await supabaseClient.auth.getSession();
      }

      if (!isMounted) {
        return;
      }

      const { data, error: sessionError } =
        await supabaseClient.auth.getSession();

      if (sessionError) {
        setStatus("error");
        setError(sessionError.message);
        return;
      }

      if (!data.session) {
        setStatus("error");
        setError(
          "Could not find an active reset session. Please request a new password reset email."
        );
        return;
      }

      setStatus("ready");
    };

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (passwordMismatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setStatus("success");

      try {
        await supabaseClient.auth.signOut();
      } catch {
        // Ignore sign-out errors to keep redirect snappy.
      }

      navigate("/login", {
        replace: true,
        state: { passwordResetSuccess: true },
      });
      return;
    } catch (updateException) {
      const message =
        updateException instanceof Error
          ? updateException.message
          : "Unable to update password. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (status === "pending") {
      return (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Validating your password reset request…
          </p>
        </CardContent>
      );
    }

    if (status === "error") {
      return (
        <CardContent className="space-y-4">
          <p className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error ??
              "Something went wrong while preparing your password reset link."}
          </p>
        </CardContent>
      );
    }

    if (status === "success") {
      return (
        <CardContent>
          <p className="rounded border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
            Password updated successfully. Redirecting to the login page...
          </p>
        </CardContent>
      );
    }

    return (
      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="new-password"
              className="text-sm font-semibold text-foreground"
            >
              New password
            </Label>
            <Input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-foreground"
            >
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          {passwordMismatch && (
            <p className="text-sm text-destructive">Passwords do not match.</p>
          )}

          {error && (
            <p className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full"
            type="submit"
            disabled={isSubmitting || passwordMismatch}
          >
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </CardFooter>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
        </CardHeader>
        {renderContent()}
      </Card>
    </div>
  );
};

export default ConfirmResetPasswordPage;
