import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Temporal } from "temporal-polyfill";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const recurrenceOptions = ["none", "weekly"] as const;
type Recurrence = (typeof recurrenceOptions)[number];

const editEventSchema = z
  .object({
    title: z.string().trim().min(1, "Please enter a title."),
    type: z.enum(["availability", "unavailability"]),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
    recurrence: z.enum(recurrenceOptions),
  })
  .refine(
    (values) => {
      try {
        const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
        const startZoned = Temporal.ZonedDateTime.from(
          `${values.startDate}T${values.startTime}:00[${tz}]`
        );
        const endZoned = Temporal.ZonedDateTime.from(
          `${values.endDate}T${values.endTime}:00[${tz}]`
        );
        return Temporal.ZonedDateTime.compare(startZoned, endZoned) === -1;
      } catch {
        return true;
      }
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type EditEventFormValues = z.infer<typeof editEventSchema>;

export const EditEventForm: React.FC<EditEventFormProps> = ({
  occurrence,
  onSuccess,
  onCancel,
  startDate: initialStartDate,
  endDate: initialEndDate,
}) => {
  const event = occurrence.originalEvent;
  const [scope, setScope] = useState<"this" | "following" | "all">("this");
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const initialValues = useMemo(() => {
    const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
    const normalizeType = (
      rawType?: string | null
    ): "availability" | "unavailability" => {
      const trimmed = (rawType ?? "").toLowerCase().trim();
      if (trimmed === "unavailability") return "unavailability";
      return "availability";
    };

    const baseStartInstant = occurrence.occurrenceStart || event.startDateTime;
    const durationMs =
      new Date(event.endDateTime).getTime() -
      new Date(event.startDateTime).getTime();
    const endInstant = new Date(
      new Date(baseStartInstant).getTime() + durationMs
    ).toISOString();

    const startZdt =
      Temporal.Instant.from(baseStartInstant).toZonedDateTimeISO(tz);
    const endZdt = Temporal.Instant.from(endInstant).toZonedDateTimeISO(tz);

    const startDateStr = startZdt.toPlainDate().toString();
    const startTimeStr = `${String(startZdt.hour).padStart(2, "0")}:${String(
      startZdt.minute
    ).padStart(2, "0")}`;
    const endDateStr = endZdt.toPlainDate().toString();
    const endTimeStr = `${String(endZdt.hour).padStart(2, "0")}:${String(
      endZdt.minute
    ).padStart(2, "0")}`;

    const recurrence: Recurrence =
      event.rrule && event.rrule.includes("WEEKLY") ? "weekly" : "none";

    return {
      title: event.title || "",
      type: normalizeType(event.type),
      startDate: startDateStr,
      startTime: startTimeStr,
      endDate: endDateStr,
      endTime: endTimeStr,
      recurrence,
    };
  }, [event, occurrence]);

  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(editEventSchema),
    mode: "onChange",
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;

      const startZoned = Temporal.ZonedDateTime.from(
        `${values.startDate}T${values.startTime}:00[${tz}]`
      );
      const endZoned = Temporal.ZonedDateTime.from(
        `${values.endDate}T${values.endTime}:00[${tz}]`
      );

      const startDateTime = startZoned.toInstant().toString();
      const endDateTime = endZoned.toInstant().toString();

      const occurrenceStartDate = new Date(occurrence.occurrenceStart);

      const input: Record<string, unknown> = {
        id: event.id,
        title: values.title.trim(),
        type: values.type,
      };

      if (scope !== "all" || !event.rrule) {
        input.startDateTime = startDateTime;
        input.endDateTime = endDateTime;
      }

      await mutate({
        variables: {
          input,
          scope,
          occurrenceStart: occurrenceStartDate,
        },
      });

      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to update event"
      );
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Team Meeting"
          {...form.register("title")}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="type">Type *</Label>
        <Select
          value={form.watch("type")}
          onValueChange={(v) =>
            form.setValue("type", v as "availability" | "unavailability")
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
        {form.formState.errors.type && (
          <p className="text-sm text-destructive">
            {form.formState.errors.type.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            {...form.register("startDate")}
            aria-invalid={!!form.formState.errors.startDate}
          />
          {form.formState.errors.startDate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="startTime">Time *</Label>
          <Input
            id="startTime"
            type="time"
            {...form.register("startTime")}
            aria-invalid={!!form.formState.errors.startTime}
          />
          {form.formState.errors.startTime && (
            <p className="text-sm text-destructive">
              {form.formState.errors.startTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            {...form.register("endDate")}
            aria-invalid={!!form.formState.errors.endDate}
          />
          {form.formState.errors.endDate && (
            <p className="text-sm text-destructive">
              {form.formState.errors.endDate.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="endTime">Time *</Label>
          <Input
            id="endTime"
            type="time"
            {...form.register("endTime")}
            aria-invalid={!!form.formState.errors.endTime}
          />
          {form.formState.errors.endTime && (
            <p className="text-sm text-destructive">
              {form.formState.errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="recurrence">Recurrence</Label>
        <Select
          value={form.watch("recurrence")}
          onValueChange={(value) =>
            form.setValue("recurrence", value as Recurrence)
          }
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
        <p className="mt-1 text-xs text-muted-foreground">
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
                className="cursor-pointer font-normal"
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
                className="cursor-pointer font-normal"
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
              <Label htmlFor="scope-all" className="cursor-pointer font-normal">
                All events in series
              </Label>
            </div>
          </div>
          {scope === "all" && (
            <p className="mt-2 text-xs text-muted-foreground">
              When updating all events, date and time changes are not applied
              (only title and type). To change the time of all events, delete
              and recreate the recurring event.
            </p>
          )}
        </div>
      )}

      {submitError && (
        <div className="rounded border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || form.formState.isSubmitting}>
          {loading || form.formState.isSubmitting
            ? "Updating..."
            : "Update Event"}
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
