import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useValidateInviteCodeQuery } from "@/features/organization/api/useValidateInviteCodeQuery";
import { RegisterInviteCodeField } from "@/features/auth/components/register/RegisterInviteCodeField.tsx";
import { RegisterTextField } from "@/features/auth/components/register/RegisterTextField.tsx";
import { useRegisterMutation } from "@/features/auth/hooks/useRegisterMutation.ts";

const registerSchema = z
  .object({
    inviteCode: z.string().optional(),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Surname is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlInviteCode = searchParams.get("invite") || "";
  const invitePrefilled = useMemo(
    () => urlInviteCode.length > 0,
    [urlInviteCode]
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      inviteCode: urlInviteCode,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const inviteCodeValue = form.watch("inviteCode") ?? "";
  const [debouncedInviteCode, setDebouncedInviteCode] = useState<string | null>(
    inviteCodeValue?.trim() || null
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedInviteCode(inviteCodeValue.trim() || null);
    }, 500);

    return () => clearTimeout(handle);
  }, [inviteCodeValue]);

  const {
    data: inviteValidation,
    isLoading: isValidatingInvite,
    isError: inviteValidationError,
  } = useValidateInviteCodeQuery(debouncedInviteCode);

  const registerMutation = useRegisterMutation();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setSuccess(false);

    if (values.inviteCode?.trim()) {
      const valid = inviteValidation?.isValid;
      if (!valid) {
        setServerError("Please enter a valid invite code.");
        return;
      }
    }

    try {
      await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        inviteCode: values.inviteCode?.trim() || undefined,
      });

      setSuccess(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create account. Please try again.";
      setServerError(message);
    }
  });

  const hasInviteValue = inviteCodeValue.trim().length > 0;
  const inviteHasError =
    inviteValidationError ||
    (inviteValidation !== null && inviteValidation?.isValid === false);
  const inviteIsValid = inviteValidation?.isValid ?? false;
  const mutationError =
    registerMutation.error instanceof Error
      ? registerMutation.error.message
      : null;
  const errorMessage = serverError ?? mutationError;

  return (
    <Card className="w-full max-w-[480px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="space-y-4">
          <RegisterInviteCodeField
            registration={form.register("inviteCode")}
            hasValue={hasInviteValue}
            isPrefilled={invitePrefilled}
            isValidating={isValidatingInvite}
            isValid={inviteIsValid}
            hasError={inviteHasError}
            organizationName={inviteValidation?.organizationName}
            remainingUses={inviteValidation?.remainingUses}
          />

          <RegisterTextField
            id="register-first-name"
            label="Name"
            registration={form.register("firstName")}
            error={form.formState.errors.firstName?.message}
          />

          <RegisterTextField
            id="register-last-name"
            label="Surname"
            registration={form.register("lastName")}
            error={form.formState.errors.lastName?.message}
          />

          <RegisterTextField
            id="register-email"
            label="Email"
            type="email"
            autoComplete="email"
            registration={form.register("email")}
            error={form.formState.errors.email?.message}
          />

          <RegisterTextField
            id="register-password"
            label="Password"
            type="password"
            autoComplete="new-password"
            registration={form.register("password")}
            error={form.formState.errors.password?.message}
          />

          <RegisterTextField
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            registration={form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />

          {errorMessage && (
            <div className="rounded border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {success && (
            <div className="rounded border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
              Account created! Please check your email to confirm your address.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-6 pt-0">
          <Button
            className="w-full"
            type="submit"
            disabled={registerMutation.isPending || isValidatingInvite}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate("/login")}
            type="button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
