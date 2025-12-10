import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { startOfDay, addDays, subDays } from "date-fns";
import {
  useGoogleCalendarList,
  useImportGoogleCalendar,
} from "../api/useGoogleCalendar";
import { useGoogleCalendarAuth } from "../hooks/useGoogleCalendarAuth";

interface UseGoogleCalendarSyncProps {
  open: boolean;
  onSyncSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useGoogleCalendarSync = ({
  open,
  onSyncSuccess,
  onOpenChange,
}: UseGoogleCalendarSyncProps) => {
  const { toast } = useToast();
  const { requestCalendarPermission } = useGoogleCalendarAuth();

  // Default date range: past 30 days to next 90 days
  const today = useMemo(() => startOfDay(new Date()), []);
  const defaultStartDate = useMemo(() => subDays(today, 30), [today]);
  const defaultEndDate = useMemo(() => addDays(today, 90), [today]);

  const [selectedCalendarIds, setSelectedCalendarIds] = useState<Set<string>>(
    new Set()
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

  const showConnectionPrompt = !accessToken && authStatus !== "ready";

  return {
    // State
    selectedCalendarIds,
    startDate,
    endDate,
    authStatus,
    calendars,
    calendarsLoading,
    calendarsError,
    importing,
    showConnectionPrompt,

    // Actions
    toggleCalendar,
    setStartDate,
    setEndDate,
    handleSync,
    handleClose,
    handleConnectGoogle,
  };
};
