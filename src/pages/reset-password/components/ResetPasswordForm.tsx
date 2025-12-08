import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
  onSubmit: (password: string) => Promise<void>;
  isSubmitting: boolean;
  errorMessage?: string | null;
};

export const ResetPasswordForm = ({
  onSubmit,
  isSubmitting,
  errorMessage,
}: ResetPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const pending = isSubmitting || formSubmitting;

  const onFormSubmit = handleSubmit(async ({ password }) => {
    await onSubmit(password);
  });

  return (
    <form onSubmit={onFormSubmit} noValidate>
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
            type="password"
            autoComplete="new-password"
            {...register("password")}
            required
            minLength={6}
          />
          {errors.password?.message && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
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
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            required
            minLength={6}
          />
          {errors.confirmPassword?.message && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errorMessage && (
          <p className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" type="submit" disabled={pending || !isValid}>
          {pending ? "Updating..." : "Update password"}
        </Button>
      </CardFooter>
    </form>
  );
};
