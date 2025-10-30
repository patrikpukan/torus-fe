import { useMemo, useState } from "react";
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

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const appUrl = useMemo(() => {
    return "https://pukan.tech";
    // import.meta.env.VITE_APP_URL?.replace(/\/$/, "") ??
    // window.location.origin.replace(/\/$/, "")
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } =
        await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl}/reset-password/confirm`,
        });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch (resetException) {
      const message =
        resetException instanceof Error
          ? resetException.message
          : "Unable to send reset email. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reset-password-email"
              className="text-sm font-semibold"
            >
              Email
            </Label>
            <Input
              id="reset-password-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
              If the email exists, we have sent password reset instructions.
              Please check your inbox.
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset password email"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
