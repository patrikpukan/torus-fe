import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useLatestMeetingForPairing,
  useAcceptProposedTimeMutation,
  useRejectMeetingMutation,
  useCancelMeetingMutation,
  useConfirmMeetingMutation,
} from "@/features/calendar/api/useMeetingEvents";
import "temporal-polyfill/global";
import MeetingProposalModal from "./MeetingProposalModal";

type Props = {
  pairingId?: string;
  otherUserName?: string;
};

const formatRange = (startIso: string, endIso: string) => {
  try {
    const s = new Date(startIso).toLocaleString([], {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const e = new Date(endIso).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${s} – ${e}`;
  } catch {
    return `${startIso} – ${endIso}`;
  }
};

export const MeetingBanner: React.FC<Props> = ({
  pairingId,
  otherUserName,
}) => {
  const { user } = useAuth();
  const { data } = useLatestMeetingForPairing(pairingId);
  const meeting = data?.latestMeetingForPairing ?? null;

  const [proposalOpen, setProposalOpen] = useState(false);
  const [acceptProposed] = useAcceptProposedTimeMutation();
  const [rejectMeeting] = useRejectMeetingMutation();
  const [cancelMeeting] = useCancelMeetingMutation();
  const [confirmMeeting] = useConfirmMeetingMutation();

  const me = user?.id;
  const isParticipant =
    !!meeting && (meeting.userAId === me || meeting.userBId === me);

  const aConfirmed = (meeting?.userAConfirmationStatus ?? "") === "confirmed";
  const bConfirmed = (meeting?.userBConfirmationStatus ?? "") === "confirmed";
  const bothConfirmed = aConfirmed && bConfirmed;
  const anyRejected =
    (meeting?.userAConfirmationStatus ?? "") === "rejected" ||
    (meeting?.userBConfirmationStatus ?? "") === "rejected";

  // Determine if the other user has proposed a different time
  const iAmA = meeting?.userAId === me;
  const myStatus = iAmA
    ? (meeting?.userAConfirmationStatus ?? "")
    : (meeting?.userBConfirmationStatus ?? "");
  const iAmPending = myStatus === "pending";
  const myProposed = myStatus === "proposed";

  // Detect whose proposal to show (latest wins)
  type Proposal = { who: "A" | "B"; s: string; e: string };
  const latestProposal = useMemo<Proposal | null>(() => {
    if (!meeting) return null;
    const aStart = meeting.userAProposedStartDateTime;
    const aEnd = meeting.userAProposedEndDateTime;
    const bStart = meeting.userBProposedStartDateTime;
    const bEnd = meeting.userBProposedEndDateTime;
    if (aStart && bStart) {
      // Compare proposal start times to decide which is latest
      return new Date(aStart).getTime() >= new Date(bStart).getTime()
        ? ({ who: "A", s: aStart, e: aEnd! } as Proposal)
        : ({ who: "B", s: bStart, e: bEnd! } as Proposal);
    }
    if (aStart && aEnd) {
      return { who: "A", s: aStart, e: aEnd } as Proposal;
    }
    if (bStart && bEnd) {
      return { who: "B", s: bStart, e: bEnd } as Proposal;
    }
    return null;
  }, [meeting]);
  const theyProposed = latestProposal
    ? latestProposal.who === "A"
      ? !iAmA
      : iAmA
    : false;
  const proposedRange = latestProposal
    ? formatRange(latestProposal.s, latestProposal.e)
    : "";

  const scheduledRange = meeting
    ? formatRange(meeting.startDateTime, meeting.endDateTime)
    : "";

  // Only now decide not to render if prerequisites missing
  if (!pairingId || !meeting || !isParticipant) return null;

  // Each mutation invalidates the latest-meeting-for-pairing query key, so
  // react-query refetches this banner automatically after a write.
  const onAcceptProposed = async () => {
    await acceptProposed({ variables: { meetingId: meeting.id } });
  };
  const onAcceptInitial = async () => {
    await confirmMeeting({ variables: { meetingId: meeting.id } });
  };
  const onReject = async () => {
    await rejectMeeting({ variables: { meetingId: meeting.id } });
  };
  const onCancel = async () => {
    if (!me) return;
    await cancelMeeting({
      variables: {
        input: { meetingId: meeting.id, cancelledByUserId: me, reason: null },
      },
    });
  };

  return (
    <div className="mb-4 rounded-md border p-3 bg-warning/10">
      {bothConfirmed && !meeting.cancelledAt && (
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            Scheduled with {otherUserName || "user"}: {scheduledRange}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel meeting
            </Button>
          </div>
        </div>
      )}

      {!bothConfirmed && !anyRejected && !latestProposal && (
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            {meeting.createdByUserId === me
              ? `You proposed: ${scheduledRange}. Waiting for response.`
              : `${otherUserName || "User"} proposed: ${scheduledRange}`}
          </div>
          <div className="flex gap-2">
            {iAmPending && (
              <Button size="sm" onClick={onAcceptInitial}>
                Accept
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setProposalOpen(true)}
            >
              Propose different time
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject}>
              Reject
            </Button>
          </div>
        </div>
      )}

      {latestProposal && theyProposed && (
        <div className="flex flex-col gap-2">
          <div className="text-sm">
            {otherUserName || "User"} proposed: {proposedRange}
          </div>
          <div className="flex gap-2">
            {!myProposed && (
              <Button size="sm" onClick={onAcceptProposed}>
                Accept proposed
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={onReject}>
              Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setProposalOpen(true)}
            >
              Propose different time
            </Button>
          </div>
        </div>
      )}

      {latestProposal && !theyProposed && (
        <div className="flex flex-col gap-2">
          <div className="text-sm">You proposed: {proposedRange}</div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setProposalOpen(true)}
            >
              Propose different time
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject}>
              Reject
            </Button>
          </div>
        </div>
      )}

      <MeetingProposalModal
        open={proposalOpen}
        onOpenChange={setProposalOpen}
        otherUserId={iAmA ? meeting.userBId : meeting.userAId}
        pairingId={pairingId}
        meetingId={meeting.id}
      />
    </div>
  );
};

export default MeetingBanner;
