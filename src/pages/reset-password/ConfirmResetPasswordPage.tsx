import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactElement } from "react";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import {
  ErrorResetStatus,
  PendingResetStatus,
  SuccessResetStatus,
} from "./components/ResetPasswordStatus";
import { useResetPasswordSession } from "./hooks/useResetPasswordSession";
import { useUpdatePassword } from "./hooks/useUpdatePassword";

const ConfirmResetPasswordPage = () => {
  const { status: sessionStatus, errorMessage: sessionError } =
    useResetPasswordSession();
  const updatePassword = useUpdatePassword();

  const handlePasswordSubmit = async (password: string) => {
    updatePassword.reset();
    await updatePassword.mutateAsync(password);
  };

  const formError =
    updatePassword.error instanceof Error ? updatePassword.error.message : null;

  let content: ReactElement;

  if (sessionStatus === "checking") {
    content = <PendingResetStatus />;
  } else if (sessionStatus === "error") {
    content = (
      <ErrorResetStatus
        message={
          sessionError ??
          "Something went wrong while preparing your password reset link."
        }
      />
    );
  } else if (updatePassword.isSuccess) {
    content = <SuccessResetStatus />;
  } else {
    content = (
      <ResetPasswordForm
        onSubmit={handlePasswordSubmit}
        isSubmitting={updatePassword.isPending}
        errorMessage={formError}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
        </CardHeader>
        {content}
      </Card>
    </div>
  );
};

export default ConfirmResetPasswordPage;
