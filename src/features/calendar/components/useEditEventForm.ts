import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Temporal } from "temporal-polyfill";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CALENDAR_EVENTS_QUERY,
  UPDATE_CALENDAR_EVENT,
} from "../api/useCalendarEvents";
import {
  editEventSchema,
  type EditEventFormValues,
  type Occurrence,
  type Recurrence,
} from "./EditEventFormSchema";

interface UseEditEventFormProps {
  occurrence: Occurrence;
  initialStartDate?: string;
  initialEndDate?: string;
  onSuccess?: () => void;
}

export const useEditEventForm = ({
  occurrence,
  initialStartDate,
  initialEndDate,
  onSuccess,
}: UseEditEventFormProps) => {
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

  return {
    form,
    scope,
    setScope,
    submitError,
    loading,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
