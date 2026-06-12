import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterInviteCodeFieldProps = {
  registration: UseFormRegisterReturn<"inviteCode">;
  hasValue: boolean;
  isPrefilled: boolean;
  isValidating: boolean;
  isValid: boolean;
  hasError: boolean;
  organizationName?: string | null;
  remainingUses?: number | null;
};

export const RegisterInviteCodeField = ({
  registration,
  hasValue,
  isPrefilled,
  isValidating,
  isValid,
  hasError,
  organizationName,
  remainingUses,
}: RegisterInviteCodeFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor="register-invite-code" className="text-sm font-semibold">
      Invite code
    </Label>
    <div className="relative">
      <Input
        id="register-invite-code"
        {...registration}
        readOnly={isPrefilled}
        disabled={isPrefilled}
        className={
          hasValue
            ? isValidating
              ? "border-warning/40 bg-warning/10"
              : isValid
                ? "border-success/40 bg-success/5"
                : hasError || !isValid
                  ? "border-destructive/40 bg-destructive/5"
                  : ""
            : ""
        }
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {hasValue && isValidating && (
          <Loader2 className="h-4 w-4 animate-spin text-warning" />
        )}
        {hasValue && !isValidating && isValid && (
          <CheckCircle className="h-4 w-4 text-success" />
        )}
        {hasValue && !isValidating && (hasError || !isValid) && (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
      </div>
    </div>

    {isPrefilled && isValid && (
      <div className="flex items-start gap-2 rounded-md bg-primary/10 p-2.5">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-xs text-primary">
          Using an invite from your organization
        </div>
      </div>
    )}

    {hasValue && !isValidating && isValid && !isPrefilled && (
      <p className="text-xs text-success">
        {organizationName
          ? `${organizationName} (${remainingUses ?? 0} uses remaining)`
          : "Invite code valid"}
      </p>
    )}

    {hasValue && !isValidating && (hasError || !isValid) && (
      <p className="text-xs text-destructive">Invalid organization code</p>
    )}
  </div>
);
