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

const RegisterForm = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const appUrl = useMemo(() => {
    const BASE_URL = "https://pukan.tech";
    //   import.meta.env.VITE_APP_URL?.trim() || window.location.origin
    // ).replace(/\/+$/, "");

    return BASE_URL;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signUpError } = await supabaseClient.auth.signUp({
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

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(true);
    } catch (signUpException) {
      const message =
        signUpException instanceof Error
          ? signUpException.message
          : "Unable to create account. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-[480px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="register-invite-code"
              className="text-sm font-semibold"
            >
              Invite code
            </Label>
            <Input
              id="register-invite-code"
              name="inviteCode"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-first-name"
              className="text-sm font-semibold"
            >
              Name
            </Label>
            <Input
              id="register-first-name"
              name="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-last-name"
              className="text-sm font-semibold"
            >
              Surname
            </Label>
            <Input
              id="register-last-name"
              name="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-email" className="text-sm font-semibold">
              Email
            </Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-password"
              className="text-sm font-semibold"
            >
              Password
            </Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="register-confirm-password"
              className="text-sm font-semibold"
            >
              Confirm Password
            </Label>
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
              Account created! Please check your email to confirm your address.
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering…" : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
