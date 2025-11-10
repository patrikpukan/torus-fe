import React, { useState } from "react";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";
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

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => onOpenChange(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentUserId) {
      setError("Not authenticated");
      return;
    }
    if (!otherUserId) {
      setError("Missing target user");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please pick start and end");
      return;
    }

    try {
      const tz = Temporal.Now.zonedDateTimeISO().timeZoneId;
      const startZdt = Temporal.ZonedDateTime.from(
        `${startDate}T${startTime}:00[${tz}]`
      );
      const endZdt = Temporal.ZonedDateTime.from(
        `${endDate}T${endTime}:00[${tz}]`
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
              note: note || null,
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
              note: note || null,
            },
          },
        });
      }

      onOpenChange(false);
      setStartDate("");
      setEndDate("");
      setNote("");

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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose meeting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Time</Label>
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
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Time</Label>
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
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              rows={3}
              placeholder="Optional note for your colleague"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
