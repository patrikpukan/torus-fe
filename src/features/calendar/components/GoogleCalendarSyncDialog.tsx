import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfDay, addDays, subDays } from "date-fns";
import {
  useGoogleCalendarList,
  useImportGoogleCalendar,
} from "../api/useGoogleCalendar";
import { useGoogleCalendarAuth } from "../hooks/useGoogleCalendarAuth";
import { useToast } from "@/hooks/use-toast";

interface GoogleCalendarSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncSuccess?: () => void;
}

export const GoogleCalendarSyncDialog: React.FC<
  GoogleCalendarSyncDialogProps
> = ({ open, onOpenChange, onSyncSuccess }) => {
  const { toast } = useToast();
  const { requestCalendarPermission } = useGoogleCalendarAuth();

  // Default date range: past 30 days to next 90 days
  const today = useMemo(() => startOfDay(new Date()), []);
  const defaultStartDate = useMemo(() => subDays(today, 30), [today]);
  const defaultEndDate = useMemo(() => addDays(today, 90), [today]);

  const [selectedCalendarIds, setSelectedCalendarIds] = useState<Set<string>>(
    new Set() // Start with no calendars selected
  );
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [authStatus, setAuthStatus] = useState<
    "checking" | "ready" | "not-linked" | "needs-permission"
  >("checking");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const {
    data: calendarsData,
    loading: calendarsLoading,
    error: calendarsError,
    refetch: refetchCalendars,
  } = useGoogleCalendarList(accessToken);
  const [importMutation, { loading: importing }] = useImportGoogleCalendar();

  const calendars = calendarsData?.googleCalendarList || [];

  // Check auth status when dialog opens
  useEffect(() => {
    if (open) {
      // Reset selected calendars when opening
      setSelectedCalendarIds(new Set());

      // Check if we have a stored access token from OAuth
      const storedToken = sessionStorage.getItem(
        "google_calendar_access_token"
      );
      if (storedToken) {
        setAccessToken(storedToken);
        setAuthStatus("ready");
        refetchCalendars();
      } else {
        // No token stored, need to request permission
        setAuthStatus("needs-permission");
        setAccessToken(null);
      }
    }
  }, [open, refetchCalendars]);

  // If calendars fail to load, it likely means permission is missing
  useEffect(() => {
    if (calendarsError && authStatus === "ready") {
      setAuthStatus("needs-permission");
    }
  }, [calendarsError, authStatus]);

  const toggleCalendar = (calendarId: string) => {
    const newSet = new Set(selectedCalendarIds);
    if (newSet.has(calendarId)) {
      newSet.delete(calendarId);
    } else {
      newSet.add(calendarId);
    }
    setSelectedCalendarIds(newSet);
  };

  const handleSync = async () => {
    if (selectedCalendarIds.size === 0) {
      toast({
        title: "No calendars selected",
        description: "Please select at least one calendar to sync",
        variant: "destructive",
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        title: "Invalid date range",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    try {
      const calendarIdsArray = Array.from(selectedCalendarIds);
      console.log("Syncing calendars:", calendarIdsArray);

      const result = await importMutation({
        variables: {
          input: {
            calendarIds: Array.from(selectedCalendarIds),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            accessToken: accessToken || undefined,
          },
        },
      });

      if (result.data?.importGoogleCalendarEvents.success) {
        toast({
          title: "Sync successful",
          description: result.data.importGoogleCalendarEvents.message,
        });

        // Notify parent to refresh calendar
        if (onSyncSuccess) {
          onSyncSuccess();
        }

        onOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to sync Google Calendar", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Check for specific error messages
      if (
        errorMessage.includes("Calendar access denied") ||
        errorMessage.includes("grant calendar permissions")
      ) {
        toast({
          title: "Calendar access required",
          description:
            "Please sign out and sign in again to grant calendar access permissions.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sync failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleClose = () => {
    if (!importing) {
      onOpenChange(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      // This will redirect to Google OAuth and then back
      // The token will be stored in sessionStorage by the callback handler
      await requestCalendarPermission();
    } catch (error) {
      toast({
        title: "Connection failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get calendar access",
        variant: "destructive",
      });
    }
  };

  // Show connection prompt if we don't have an access token yet
  const showConnectionPrompt = !accessToken && authStatus !== "ready";

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
                    <strong>Note:</strong> Since this app is in testing mode,
                    you may need to be added to the tester list. Contact the
                    administrator if you encounter access issues.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleConnectGoogle}
                className="w-full"
                variant="default"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {authStatus === "not-linked"
                  ? "Connect Google Account"
                  : "Grant Calendar Permission"}
              </Button>
            </div>
          )}

          {/* Calendar Selection */}
          {!showConnectionPrompt && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Select Calendars
              </Label>

              {calendarsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading calendars...
                  </span>
                </div>
              )}

              {calendarsError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  Failed to load calendars. You may need to sign out and sign in
                  again to grant calendar access.
                </div>
              )}

              {!calendarsLoading &&
                !calendarsError &&
                calendars.length === 0 && (
                  <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    No calendars found. Make sure you have granted calendar
                    access permissions.
                  </div>
                )}

              {!calendarsLoading && !calendarsError && calendars.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {calendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`calendar-${calendar.id}`}
                        checked={selectedCalendarIds.has(calendar.id)}
                        onChange={() => toggleCalendar(calendar.id)}
                        className="h-4 w-4 rounded border-gray-300"
                        disabled={importing}
                      />
                      <Label
                        htmlFor={`calendar-${calendar.id}`}
                        className="flex-1 cursor-pointer text-sm font-normal"
                      >
                        <div className="flex items-center gap-2">
                          {calendar.backgroundColor && (
                            <div
                              className="h-3 w-3 rounded-full border"
                              style={{
                                backgroundColor: calendar.backgroundColor,
                              }}
                            />
                          )}
                          <span>{calendar.summary}</span>
                          {calendar.primary && (
                            <span className="text-xs text-muted-foreground">
                              (Primary)
                            </span>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Date Range Selection */}
          {!showConnectionPrompt && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm">
                    From
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                        disabled={importing}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        disabled={(date) => date > endDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm">
                    To
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                        disabled={importing}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Default: Past 30 days → Next 90 days
              </p>
            </div>
          )}

          {/* Warning Message */}
          {!showConnectionPrompt && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> All previously synced Google Calendar
                events will be replaced with fresh data from the selected date
                range.
              </p>
            </div>
          )}
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
