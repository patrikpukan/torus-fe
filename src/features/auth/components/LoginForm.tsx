import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

import { useAuth } from "@/features/auth/context/UseAuth.tsx";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();

  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const state = location.state as { passwordResetSuccess?: boolean } | null;

    if (state?.passwordResetSuccess) {
      setFlashMessage("Your password was updated successfully.");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate("/home");
    } catch (error) {
      const err = error as { message?: string };
      setFormError(err.message ?? "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      const err = error as { message?: string };
      setFormError(
        err.message ?? "Unable to sign in with Google. Please try again."
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {flashMessage && (
            <div className="rounded border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
              {flashMessage}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-email" className="font-semibold">
              Email
            </Label>
            <Input
              id="login-email"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="font-semibold">
              Password
            </Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {!!formError && (
            <div className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center text-sm text-muted-foreground">
            <span>Forgot password?</span>
            <Link
              to="/reset-password"
              className="ml-1 text-primary hover:underline"
            >
              Click here
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isSubmitting}
          >
            {isGoogleLoading ? "Signing in..." : "Log in with Google Account"}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/register">Register via invite code</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
