import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";

interface GoogleCalendarSyncConnectionPromptProps {
  authStatus: "not-linked" | "needs-permission";
  onConnect: () => void;
}

export const GoogleCalendarSyncConnectionPrompt: React.FC<
  GoogleCalendarSyncConnectionPromptProps
> = ({ authStatus, onConnect }) => {
  return (
    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-blue-900">
            {authStatus === "not-linked"
              ? "Connect Google Account"
              : "Calendar Permission Required"}
          </h3>
          <p className="text-sm text-blue-800">
            {authStatus === "not-linked"
              ? "Link your Google account to sync calendar events. You'll be redirected to Google to authorize access."
              : "Grant calendar access to sync your events. You'll need to re-authorize with additional permissions."}
          </p>
          <p className="text-xs text-blue-700 mt-2">
            <strong>Note:</strong> Since this app is in testing mode, you may
            need to be added to the tester list. Contact the administrator if
            you encounter access issues.
          </p>
        </div>
      </div>
      <Button onClick={onConnect} className="w-full" variant="default">
        <ExternalLink className="mr-2 h-4 w-4" />
        {authStatus === "not-linked"
          ? "Connect Google Account"
          : "Grant Calendar Permission"}
      </Button>
    </div>
  );
};
