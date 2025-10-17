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

const RegisterForm = () => {
  return (
    <Card className="w-full max-w-[480px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="register-invite-code"
            className="text-sm font-semibold"
          >
            Invite code
          </Label>
          <Input id="register-invite-code" name="inviteCode" />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="register-first-name"
            className="text-sm font-semibold"
          >
            Name
          </Label>
          <Input id="register-first-name" name="firstName" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-last-name" className="text-sm font-semibold">
            Surname
          </Label>
          <Input id="register-last-name" name="lastName" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-email" className="text-sm font-semibold">
            Email:
          </Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="register-password" className="text-sm font-semibold">
            Password
          </Label>
          <Input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="register-confirm-password"
            className="text-sm font-semibold"
          >
            Confirm Password
          </Label>
          <Input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
          />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
