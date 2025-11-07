import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import { Temporal } from "temporal-polyfill";
import { useAuth } from "@/hooks/useAuth";
import { CALENDAR_EVENTS_QUERY } from "../api/useCalendarEvents";
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

const CREATE_CALENDAR_EVENT = graphql(`
  mutation CreateCalendarEvent($input: CreateCalendarEventInput!) {
    createCalendarEvent(input: $input) {
      id
      title
      startDateTime
      endDateTime
      type
      rrule
    }
  }
`);

interface CalendarEventFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  startDate?: string;
  endDate?: string;
}

export const CalendarEventForm: React.FC<CalendarEventFormProps> = ({
  onSuccess,
  onCancel,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const { user } = useAuth();
  const [mutate, { loading }] = useMutation(CREATE_CALENDAR_EVENT, {
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

      let rrule: string | undefined;
      if (recurrence === "weekly") {
        // Get day of week from start date
        const day = new Date(startDate).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const dayMap: Record<string, string> = {
          Mon: "MO",
          Tue: "TU",
          Wed: "WE",
          Thu: "TH",
          Fri: "FR",
          Sat: "SA",
          Sun: "SU",
        };
        rrule = `FREQ=WEEKLY;BYDAY=${dayMap[day]}`;
      }

      await mutate({
        variables: {
          input: {
            title,
            type,
            startDateTime,
            endDateTime,
            rrule,
            userId: user?.id,
          },
        },
      });

      setTitle("");
      setType("availability");
      setStartDate("");
      setEndDate("");
      setRecurrence("none");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    }
  };

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
          value={type}
          onValueChange={(value) =>
            setType(value as "availability" | "unavailability")
          }
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
        >
          <SelectTrigger id="recurrence">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No recurrence</SelectItem>
            <SelectItem value="weekly">Every week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
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
