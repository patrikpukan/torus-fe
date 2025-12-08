import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-lg space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Lock className="h-8 w-8" aria-hidden />
        </div>
        <div className="space-y-2">
          <p className="text-5xl font-semibold text-foreground">403</p>
          <h1 className="text-2xl font-semibold text-foreground">
            Access denied
          </h1>
          <p className="text-sm text-muted-foreground">
            You do not have permission to access this page. If you believe this
            is an error, please contact your administrator.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate("/")}>Go to home</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
