import React, { useEffect, useState } from "react";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useApolloClient } from "@apollo/client/react";
import {
  useCreateMeetingMutation,
  useProposeMeetingTimeMutation,
} from "@/features/calendar/api/useMeetingEvents";
import { LATEST_MEETING_FOR_PAIRING_QUERY } from "@/features/calendar/api/useMeetingEvents";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherUserId: string;
  pairingId?: string;
  meetingId?: string; // when set, this modal proposes a new time for an existing meeting
  startDate?: string; // ISO (UTC) range hint for refetch windows if needed
  endDate?: string; // not used yet
};

const meetingProposalSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
    note: z.string().optional(),
  })
  .refine(
    (values) => {
      try {
        const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
        const startZdt = Temporal.ZonedDateTime.from(
          `${values.startDate}T${values.startTime}:00[${tz}]`
        );
        const endZdt = Temporal.ZonedDateTime.from(
          `${values.endDate}T${values.endTime}:00[${tz}]`
        );
        return Temporal.ZonedDateTime.compare(startZdt, endZdt) === -1;
      } catch {
        return true;
      }
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type MeetingProposalFormValues = z.infer<typeof meetingProposalSchema>;

export const MeetingProposalModal: React.FC<Props> = ({
  open,
  onOpenChange,
  otherUserId,
  pairingId,
  meetingId,
}) => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [createMeeting, { loading: creating }] = useCreateMeetingMutation();
  const [proposeTime, { loading: proposing }] = useProposeMeetingTimeMutation();
  const apollo = useApolloClient();

  const [error, setError] = useState<string | null>(null);
  const form = useForm<MeetingProposalFormValues>({
    resolver: zodResolver(meetingProposalSchema),
    mode: "onChange",
    defaultValues: {
      startDate: "",
      startTime: "09:00",
      endDate: "",
      endTime: "10:00",
      note: "",
    },
  });

  const handleClose = () => onOpenChange(false);

  useEffect(() => {
    if (!open) {
      form.reset();
      setError(null);
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    setError(null);
    if (!currentUserId) {
      setError("Not authenticated");
      return;
    }
    if (!otherUserId) {
      setError("Missing target user");
      return;
    }

    try {
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
      const startZdt = Temporal.ZonedDateTime.from(
        `${values.startDate}T${values.startTime}:00[${tz}]`
      );
      const endZdt = Temporal.ZonedDateTime.from(
        `${values.endDate}T${values.endTime}:00[${tz}]`
      );
      const startDateTime = startZdt.toInstant().toString();
      const endDateTime = endZdt.toInstant().toString();

      if (meetingId) {
        await proposeTime({
          variables: {
            input: {
              meetingId,
              userId: currentUserId,
              status: "proposed",
              proposedStartDateTime: startDateTime,
              proposedEndDateTime: endDateTime,
              note: values.note?.trim() || null,
            },
          },
        });
      } else {
        await createMeeting({
          variables: {
            input: {
              pairingId: pairingId ?? null,
              userAId: currentUserId,
              userBId: otherUserId,
              createdByUserId: currentUserId,
              startDateTime,
              endDateTime,
              note: values.note?.trim() || null,
            },
          },
        });
      }

      onOpenChange(false);
      form.reset();

      if (pairingId) {
        await apollo.query({
          query: LATEST_MEETING_FOR_PAIRING_QUERY,
          variables: { pairingId },
          fetchPolicy: "network-only",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to propose meeting"
      );
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
                required
              />
              {form.formState.errors.startDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="startTime">Time</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
                required
              />
              {form.formState.errors.startTime && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.startTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...form.register("endDate")}
                required
              />
              {form.formState.errors.endDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="endTime">Time</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register("endTime")}
                required
              />
              {form.formState.errors.endTime && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              rows={3}
              placeholder="Optional note for your colleague"
              {...form.register("note")}
            />
          </div>

          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={creating || proposing}>
              {creating || proposing ? "Sending..." : "Propose"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingProposalModal;
