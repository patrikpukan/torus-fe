import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { Temporal } from "temporal-polyfill";
import {
  CALENDAR_EVENTS_QUERY,
  UPDATE_CALENDAR_EVENT,
} from "../api/useCalendarEvents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalendarEventItem } from "../api/useCalendarEvents";

type Occurrence = {
  id: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  originalEvent: CalendarEventItem;
};

interface EditEventFormProps {
  occurrence: Occurrence;
  onSuccess?: () => void;
  onCancel?: () => void;
  startDate?: string;
  endDate?: string;
}

export const EditEventForm: React.FC<EditEventFormProps> = ({
  occurrence,
  onSuccess,
  onCancel,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const event = occurrence.originalEvent;
  const [scope, setScope] = useState<"this" | "following" | "all">("this");
  const [mutate, { loading }] = useMutation(UPDATE_CALENDAR_EVENT, {
    refetchQueries: [
      {
        query: CALENDAR_EVENTS_QUERY,
        variables: {
          startDate: initialStartDate || "",
          endDate: initialEndDate || "",
        },
      },
    ],
  });

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"availability" | "unavailability">(
    "availability"
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [recurrence, setRecurrence] = useState<"none" | "weekly">("none");
  const [error, setError] = useState<string | null>(null);

  // Initialize form with event data
  useEffect(() => {
    if (event && occurrence) {
      setTitle(event.title || "");

      // Make sure we cast the type correctly and trim any whitespace
      let eventType: "availability" | "unavailability" = "availability";
      if (event.type) {
        const trimmedType = String(event.type).trim().toLowerCase();
        console.log(
          "Event type from API:",
          event.type,
          "trimmed:",
          trimmedType
        );
        if (trimmedType === "unavailability") {
          eventType = "unavailability";
        } else if (trimmedType === "availability") {
          eventType = "availability";
        }
      }
      console.log("Setting form type to:", eventType);
      setType(eventType);

      // Convert UTC times to user's local timezone
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

      try {
        // For recurring events, use the occurrence's datetime, not the base event's datetime
        // This ensures the form shows the correct date for the specific occurrence being edited
        const baseStartInstant = occurrence.occurrenceStart
          ? occurrence.occurrenceStart
          : event.startDateTime;
        const durationMs =
          new Date(event.endDateTime).getTime() -
          new Date(event.startDateTime).getTime();
        const endInstant = new Date(
          new Date(baseStartInstant).getTime() + durationMs
        ).toISOString();

        const startZdt =
          Temporal.Instant.from(baseStartInstant).toZonedDateTimeISO(tz);
        const endZdt = Temporal.Instant.from(endInstant).toZonedDateTimeISO(tz);

        // Format date and time strings
        const startDateStr = startZdt.toPlainDate().toString();
        const startTimeStr = `${String(startZdt.hour).padStart(2, "0")}:${String(startZdt.minute).padStart(2, "0")}`;
        const endDateStr = endZdt.toPlainDate().toString();
        const endTimeStr = `${String(endZdt.hour).padStart(2, "0")}:${String(endZdt.minute).padStart(2, "0")}`;

        setStartDate(startDateStr);
        setStartTime(startTimeStr);
        setEndDate(endDateStr);
        setEndTime(endTimeStr);
      } catch (err) {
        console.error("Error parsing event dates:", err);
      }

      // Set recurrence - parse rrule properly
      if (event.rrule) {
        if (event.rrule.includes("WEEKLY")) {
          setRecurrence("weekly");
        } else {
          setRecurrence("none");
        }
      } else {
        setRecurrence("none");
      }
    }
  }, [event, occurrence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !startDate || !endDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      // Get user's timezone
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

      // Create dates in user's local timezone, then convert to UTC for storage
      const startZoned = Temporal.ZonedDateTime.from(
        `${startDate}T${startTime}:00[${tz}]`
      );
      const endZoned = Temporal.ZonedDateTime.from(
        `${endDate}T${endTime}:00[${tz}]`
      );

      const startDateTime = startZoned.toInstant().toString();
      const endDateTime = endZoned.toInstant().toString();

      // Convert occurrence start to Date for backend
      const occurrenceStartDate = new Date(occurrence.occurrenceStart);

      const input: Record<string, unknown> = {
        id: event.id,
        title,
      };

      // For "all events" scope on recurring events, don't send startDateTime/endDateTime
      // Changing the base event's start time would break the recurrence pattern
      if (scope !== "all" || !event.rrule) {
        input.startDateTime = startDateTime;
        input.endDateTime = endDateTime;
      }

      if (type) {
        input.type = type;
      }

      await mutate({
        variables: {
          input,
          scope,
          occurrenceStart: occurrenceStartDate,
        },
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    }
  };

  console.log("type", type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Team Meeting"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type *</Label>
        <Select
          key={type}
          value={type}
          onValueChange={(v) => setType(v as "availability" | "unavailability")}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="availability">Available</SelectItem>
            <SelectItem value="unavailability">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="startTime">Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="recurrence">Recurrence</Label>
        <Select
          value={recurrence}
          onValueChange={(value) => setRecurrence(value as "none" | "weekly")}
          disabled
        >
          <SelectTrigger id="recurrence">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No recurrence</SelectItem>
            <SelectItem value="weekly">Every week</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Recurrence cannot be edited. Delete and recreate the event to change
          recurrence.
        </p>
      </div>

      {event.rrule && (
        <div className="space-y-3 border-y py-4">
          <Label>Update scope</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="scope-this"
                value="this"
                checked={scope === "this"}
                onChange={(e) =>
                  setScope(e.target.value as "this" | "following" | "all")
                }
                disabled={loading}
              />
              <Label
                htmlFor="scope-this"
                className="font-normal cursor-pointer"
              >
                This event only
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="scope-following"
                value="following"
                checked={scope === "following"}
                onChange={(e) =>
                  setScope(e.target.value as "this" | "following" | "all")
                }
                disabled={loading}
              />
              <Label
                htmlFor="scope-following"
                className="font-normal cursor-pointer"
              >
                This and following events
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="scope-all"
                value="all"
                checked={scope === "all"}
                onChange={(e) =>
                  setScope(e.target.value as "this" | "following" | "all")
                }
                disabled={loading}
              />
              <Label htmlFor="scope-all" className="font-normal cursor-pointer">
                All events in series
              </Label>
            </div>
          </div>
          {scope === "all" && (
            <p className="text-xs text-muted-foreground mt-2">
              When updating all events, date and time changes are not applied
              (only title and type). To change the time of all events, delete
              and recreate the recurring event.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Event"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
