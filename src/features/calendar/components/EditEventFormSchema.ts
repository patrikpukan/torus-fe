import { Temporal } from "temporal-polyfill";
import { z } from "zod";
import type { CalendarEventItem } from "../api/useCalendarEvents";

export const recurrenceOptions = ["none", "weekly"] as const;
export type Recurrence = (typeof recurrenceOptions)[number];

export const editEventSchema = z
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

export type EditEventFormValues = z.infer<typeof editEventSchema>;

export type Occurrence = {
  id: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  originalEvent: CalendarEventItem;
};
