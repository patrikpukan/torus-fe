import React, { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { graphql } from "gql.tada";
import { Temporal } from "temporal-polyfill";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

const recurrenceOptions = [
  "none",
  "daily",
  "weekly",
  "biweekly",
  "monthly",
] as const;

type Recurrence = (typeof recurrenceOptions)[number];

const calendarEventSchema = z
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

type CalendarEventFormValues = z.infer<typeof calendarEventSchema>;

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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaultDates = useMemo(() => {
    const parseDate = (value?: string) => {
      if (!value) return "";
      try {
        return Temporal.PlainDate.from(value).toString();
      } catch {
        try {
          return Temporal.Instant.from(value)
            .toZonedDateTimeISO("UTC")
            .toPlainDate()
            .toString();
        } catch {
          return "";
        }
      }
    };

    return {
      startDate: parseDate(initialStartDate),
      endDate: parseDate(initialEndDate),
    };
  }, [initialStartDate, initialEndDate]);

  const form = useForm<CalendarEventFormValues>({
    resolver: zodResolver(calendarEventSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      type: "availability",
      startDate: defaultDates.startDate,
      startTime: "09:00",
      endDate: defaultDates.endDate,
      endTime: "10:00",
      recurrence: "none",
    },
  });

  const buildRrule = (recurrence: Recurrence, startDate: string) => {
    if (recurrence === "none") return undefined;
    if (recurrence === "daily") return "FREQ=DAILY";
    if (recurrence === "monthly") {
      const startPlainDate = Temporal.PlainDate.from(startDate);
      return `FREQ=MONTHLY;BYMONTHDAY=${startPlainDate.day}`;
    }

    const startPlainDate = Temporal.PlainDate.from(startDate);
    const dayOfWeek = startPlainDate.dayOfWeek; // 1=Monday, 7=Sunday
    const dayMap: Record<number, string> = {
      1: "MO",
      2: "TU",
      3: "WE",
      4: "TH",
      5: "FR",
      6: "SA",
      7: "SU",
    };
    const dayCode = dayMap[dayOfWeek];
    if (!dayCode) return undefined;

    if (recurrence === "weekly") {
      return `FREQ=WEEKLY;BYDAY=${dayCode}`;
    }
    if (recurrence === "biweekly") {
      return `FREQ=WEEKLY;INTERVAL=2;BYDAY=${dayCode}`;
    }
    return undefined;
  };

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
      const rrule = buildRrule(values.recurrence, values.startDate);

      await mutate({
        variables: {
          input: {
            title: values.title.trim(),
            type: values.type,
            startDateTime,
            endDateTime,
            rrule,
            userId: user?.id,
          },
        },
      });

      form.reset({
        title: "",
        type: "availability",
        startDate: defaultDates.startDate,
        startTime: "09:00",
        endDate: defaultDates.endDate,
        endTime: "10:00",
        recurrence: "none",
      });

      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create event"
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
          onValueChange={(value) =>
            form.setValue("type", value as "availability" | "unavailability")
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
            form.setValue(
              "recurrence",
              value as (typeof recurrenceOptions)[number]
            )
          }
        >
          <SelectTrigger id="recurrence">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No recurrence</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Every week</SelectItem>
            <SelectItem value="biweekly">Every 2 weeks</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {submitError && (
        <div className="rounded border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading || form.formState.isSubmitting}>
          {loading || form.formState.isSubmitting
            ? "Creating..."
            : "Create Event"}
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
