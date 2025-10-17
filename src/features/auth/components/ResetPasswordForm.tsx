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

const ResetPasswordForm = () => {
  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="reset-password-email"
            className="text-sm font-semibold"
          >
            Email:
          </Label>
          <Input
            id="reset-password-email"
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full">Send reset password email</Button>
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordForm;
