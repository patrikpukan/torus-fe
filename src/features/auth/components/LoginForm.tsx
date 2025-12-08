import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/features/auth/context/UseAuth.tsx";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().nonempty("Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();

  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const state = location.state as { passwordResetSuccess?: boolean } | null;

    if (state?.passwordResetSuccess) {
      setFlashMessage("Your password was updated successfully.");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    setFormError(null);

    try {
      await signIn(values.email, values.password);
      navigate("/home");
    } catch (error) {
      const err = error as { message?: string };
      setFormError(err.message ?? "Unable to sign in. Please try again.");
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <CardContent className="space-y-4">
            {flashMessage && (
              <div className="rounded border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                {flashMessage}
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging in..." : "Log in"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || form.formState.isSubmitting}
            >
              {isGoogleLoading ? "Signing in..." : "Log in with Google Account"}
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/register">Register via invite code</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
