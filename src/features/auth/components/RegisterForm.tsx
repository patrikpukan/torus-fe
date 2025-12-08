import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
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
import { useValidateInviteCodeQuery } from "@/features/organization/api/useValidateInviteCodeQuery";
import { appUrl } from "@/lib/appUrl";

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const urlInviteCode = searchParams.get("invite") || "";

  const [inviteCode, setInviteCode] = useState("");
  const [isInvitePreFilled, setIsInvitePreFilled] = useState(false);
  const [debouncedInviteCode, setDebouncedInviteCode] = useState<string | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fill invite code from URL on mount
  useEffect(() => {
    if (urlInviteCode) {
      setInviteCode(urlInviteCode);
      setIsInvitePreFilled(true);
      // Immediately trigger validation for pre-filled code
      setDebouncedInviteCode(urlInviteCode);
    }
  }, [urlInviteCode]);

  // Validate invite code with debounce
  const {
    data: inviteValidation,
    isLoading: isValidatingInvite,
    isError: inviteValidationError,
  } = useValidateInviteCodeQuery(debouncedInviteCode);

  // Debounced invite code validation (only when user types, not when pre-filled)
  useEffect(() => {
    // Skip debounce if this is the initial pre-fill from URL
    if (isInvitePreFilled && inviteCode === urlInviteCode) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedInviteCode(inviteCode.trim() || null);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inviteCode, isInvitePreFilled, urlInviteCode]);

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

    // Validate invite code if provided
    if (inviteCode.trim()) {
      if (!inviteValidation || !inviteValidation.isValid) {
        setError("Please enter a valid invite code.");
        return;
      }
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
            invite_code: inviteCode.trim() || undefined,
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
            <div className="relative">
              <Input
                id="register-invite-code"
                name="inviteCode"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                readOnly={isInvitePreFilled}
                disabled={isInvitePreFilled}
                className={
                  inviteCode.trim()
                    ? isValidatingInvite
                      ? "border-amber-200 bg-amber-50/30"
                      : inviteValidation?.isValid
                        ? "border-emerald-600/40 bg-emerald-500/5"
                        : inviteValidationError || !inviteValidation?.isValid
                          ? "border-red-600/40 bg-red-500/5"
                          : ""
                    : ""
                }
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {inviteCode.trim() && isValidatingInvite && (
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                )}
                {inviteCode.trim() &&
                  !isValidatingInvite &&
                  inviteValidation?.isValid && (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  )}
                {inviteCode.trim() &&
                  !isValidatingInvite &&
                  (inviteValidationError || !inviteValidation?.isValid) && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
              </div>
            </div>

            {/* Helper text for pre-filled invite */}
            {isInvitePreFilled && inviteValidation?.isValid && (
              <div className="flex items-start gap-2 rounded-md bg-blue-50/60 p-2.5">
                <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  Using an invite from your organization
                </div>
              </div>
            )}

            {/* Validation success text */}
            {inviteCode.trim() &&
              !isValidatingInvite &&
              inviteValidation?.isValid &&
              !isInvitePreFilled && (
                <p className="text-xs text-emerald-700">
                  ✓ {inviteValidation.organizationName} (
                  {inviteValidation.remainingUses} uses remaining)
                </p>
              )}

            {/* Validation error text */}
            {inviteCode.trim() &&
              !isValidatingInvite &&
              (inviteValidationError || !inviteValidation?.isValid) && (
                <p className="text-xs text-red-600">
                  Invalid organization code
                </p>
              )}
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
