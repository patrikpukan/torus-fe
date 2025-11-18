import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseClient } from "@/lib/supabaseClient";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState(
    "Finishing sign-in… please wait."
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const completeAuth = async () => {
      // Some Supabase flows deliver a `code` via query params that must be exchanged manually.
      const searchParams = new URLSearchParams(window.location.search);
      const verificationCode = searchParams.get("code");

      if (verificationCode) {
        const { error } =
          await supabaseClient.auth.exchangeCodeForSession(verificationCode);


        if (error) {
          setHasError(true);
          setStatusMessage(error.message);
          return;
        }
      }

      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        setHasError(true);
        setStatusMessage(error.message);
        return;
      }

      if (data.session) {
        setStatusMessage("Email verified! Redirecting you to the app…");
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 2000);
      } else {
        setStatusMessage(
          "Email verified! You can return to the application and sign in."
        );
      }
    };

    void completeAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Email verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={
              hasError
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {statusMessage}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
