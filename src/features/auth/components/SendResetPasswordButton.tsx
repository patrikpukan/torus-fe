import { useMemo, useState, type ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { supabaseClient } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

type ButtonProps = ComponentProps<typeof Button>;

type SendResetPasswordButtonProps = {
  email?: string | null;
  redirectPath?: string;
  successMessage?: string;
  errorTitle?: string;
} & Omit<ButtonProps, "onClick">;

const DEFAULT_REDIRECT_PATH = "/reset-password/confirm";

const SendResetPasswordButton = ({
  email,
  redirectPath = DEFAULT_REDIRECT_PATH,
  successMessage = "If the email exists, we have sent password reset instructions.",
  errorTitle = "Unable to send reset email",
  children,
  disabled,
  ...buttonProps
}: SendResetPasswordButtonProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const appUrl = useMemo(() => {
    return (
      import.meta.env.VITE_APP_URL?.replace(/\/$/, "") ??
      window.location.origin.replace(/\/$/, "")
    );
  }, []);

  const handleSendReset = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: errorTitle,
        description: "No email address is available for this user.",
      });
      return;
    }

    setIsSending(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}${redirectPath}`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: errorTitle,
          description: error.message || "Please try again later.",
        });
        return;
      }

      toast({
        title: "Reset email sent",
        description: successMessage,
      });
    } catch (exception) {
      toast({
        variant: "destructive",
        title: errorTitle,
        description:
          exception instanceof Error
            ? exception.message
            : "Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSendReset}
      disabled={isSending || disabled}
      {...buttonProps}
    >
      {isSending ? "Sending..." : (children ?? "Send reset password email")}
    </Button>
  );
};

export default SendResetPasswordButton;
