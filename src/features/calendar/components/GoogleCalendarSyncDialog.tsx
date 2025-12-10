import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React from "react";
import { GoogleCalendarDateRangePicker } from "./GoogleCalendarDateRangePicker";
import { GoogleCalendarSelection } from "./GoogleCalendarSelection";
import { GoogleCalendarSyncConnectionPrompt } from "./GoogleCalendarSyncConnectionPrompt";
import { GoogleCalendarSyncWarning } from "./GoogleCalendarSyncWarning";
import { useGoogleCalendarSync } from "./useGoogleCalendarSync";

interface GoogleCalendarSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncSuccess?: () => void;
}

export const GoogleCalendarSyncDialog: React.FC<
  GoogleCalendarSyncDialogProps
> = ({ open, onOpenChange, onSyncSuccess }) => {
  const {
    selectedCalendarIds,
    startDate,
    endDate,
    authStatus,
    calendars,
    calendarsLoading,
    calendarsError,
    importing,
    showConnectionPrompt,
    toggleCalendar,
    setStartDate,
    setEndDate,
    handleSync,
    handleClose,
    handleConnectGoogle,
  } = useGoogleCalendarSync({
    open,
    onSyncSuccess,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Sync with Google Calendar</DialogTitle>
          <DialogDescription>
            Import events from your Google Calendar. Existing synced events will
            be replaced with fresh data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Google Connection Required */}
          {showConnectionPrompt && (
            <GoogleCalendarSyncConnectionPrompt
              authStatus={
                authStatus === "checking" || authStatus === "ready"
                  ? "needs-permission"
                  : authStatus
              }
              onConnect={handleConnectGoogle}
            />
          )}

          {/* Calendar Selection */}
          {!showConnectionPrompt && (
            <GoogleCalendarSelection
              calendars={calendars}
              selectedCalendarIds={selectedCalendarIds}
              onToggleCalendar={toggleCalendar}
              loading={calendarsLoading}
              error={calendarsError}
              disabled={importing}
            />
          )}

          {/* Date Range Selection */}
          {!showConnectionPrompt && (
            <GoogleCalendarDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              disabled={importing}
            />
          )}

          {/* Warning Message */}
          {!showConnectionPrompt && <GoogleCalendarSyncWarning />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            Cancel
          </Button>
          {!showConnectionPrompt && (
            <Button
              onClick={handleSync}
              disabled={importing || calendarsLoading || calendars.length === 0}
            >
              {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {importing ? "Syncing..." : "Sync Now"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
