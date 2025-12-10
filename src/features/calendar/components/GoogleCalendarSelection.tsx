import React from "react";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { GoogleCalendar } from "../api/useGoogleCalendar";

interface GoogleCalendarSelectionProps {
  calendars: GoogleCalendar[];
  selectedCalendarIds: Set<string>;
  onToggleCalendar: (calendarId: string) => void;
  loading?: boolean;
  error?: Error | null;
  disabled?: boolean;
}

export const GoogleCalendarSelection: React.FC<
  GoogleCalendarSelectionProps
> = ({
  calendars,
  selectedCalendarIds,
  onToggleCalendar,
  loading = false,
  error = null,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select Calendars</Label>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading calendars...
          </span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load calendars. You may need to sign out and sign in again
          to grant calendar access.
        </div>
      )}

      {!loading && !error && calendars.length === 0 && (
        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          No calendars found. Make sure you have granted calendar access
          permissions.
        </div>
      )}

      {!loading && !error && calendars.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {calendars.map((calendar) => (
            <div key={calendar.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`calendar-${calendar.id}`}
                checked={selectedCalendarIds.has(calendar.id)}
                onChange={() => onToggleCalendar(calendar.id)}
                className="h-4 w-4 rounded border-gray-300"
                disabled={disabled}
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
  );
};
