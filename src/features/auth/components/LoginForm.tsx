import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";

const LoginForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-username-email" className="font-semibold">
            Email:
          </Label>
          <Input
            id="login-username-email"
            name="username"
            autoComplete="username"
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
          />
        </div>
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
        <Button asChild className="w-full">
          <NavLink to="/">Log in</NavLink>
        </Button>
        <Button variant="outline" className="w-full">
          Log in with Google Account
        </Button>
        <Button asChild variant="outline" className="w-full">
          <NavLink to="/register">Register via invite code</NavLink>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
