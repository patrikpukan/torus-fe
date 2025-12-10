import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { appUrl } from "@/lib/appUrl";

const resetPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } =
        await supabaseClient.auth.resetPasswordForEmail(values.email, {
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
    }
  });

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
              type="email"
              autoComplete="email"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
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
          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Sending..."
              : "Send reset password email"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
