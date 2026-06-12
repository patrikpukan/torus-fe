import { CardContent } from "@/components/ui/card";

export const PendingResetStatus = () => (
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Validating your password reset request...
    </p>
  </CardContent>
);

export const ErrorResetStatus = ({ message }: { message: string }) => (
  <CardContent className="space-y-4">
    <p className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  </CardContent>
);

export const SuccessResetStatus = () => (
  <CardContent>
    <p className="rounded border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
      Password updated successfully. Redirecting to the login page...
    </p>
  </CardContent>
);
