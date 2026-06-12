import React, { useState } from "react";
import {
  usePendingConfirmations,
  useConfirmMeetingMutation,
  useRejectMeetingMutation,
} from "../api/useMeetingEvents";
import { format } from "date-fns";

export const PendingMeetingConfirmations: React.FC = () => {
  const { data, loading, error } = usePendingConfirmations();
  const [confirmMutation] = useConfirmMeetingMutation();
  const [rejectMutation] = useRejectMeetingMutation();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null
  );
  const [note, setNote] = useState("");

  const handleConfirm = async (meetingId: string) => {
    try {
      await confirmMutation({
        variables: {
          meetingId,
          note: note || undefined,
        },
      });
      setSelectedMeetingId(null);
      setNote("");
    } catch (err) {
      console.error("Error confirming meeting:", err);
    }
  };

  const handleReject = async (meetingId: string) => {
    try {
      await rejectMutation({
        variables: {
          meetingId,
          note: note || undefined,
        },
      });
      setSelectedMeetingId(null);
      setNote("");
    } catch (err) {
      console.error("Error rejecting meeting:", err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading pending confirmations...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error loading confirmations: {error.message}
      </div>
    );
  }

  const pending = data?.pendingMeetingConfirmations || [];

  if (pending.length === 0) {
    return <div className="p-4 text-gray-500">No pending confirmations</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Pending Confirmations</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {pending.map((meeting) => (
          <div
            key={meeting.id}
            className="p-2 rounded border border-warning/40 bg-warning/10"
          >
            <div className="text-xs">
              <div className="font-medium">
                {format(new Date(meeting.startDateTime), "dd.MM HH:mm")} -{" "}
                {format(new Date(meeting.endDateTime), "HH:mm")}
              </div>

              {selectedMeetingId === meeting.id ? (
                <div className="mt-2 space-y-1">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)"
                    className="w-full text-xs p-1 border rounded"
                    rows={2}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleConfirm(meeting.id)}
                      className="flex-1 px-2 py-1 bg-success text-success-foreground rounded text-xs hover:bg-success/90"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleReject(meeting.id)}
                      className="flex-1 px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMeetingId(null);
                        setNote("");
                      }}
                      className="flex-1 px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedMeetingId(meeting.id)}
                  className="mt-1 px-2 py-0.5 bg-warning text-warning-foreground rounded text-xs hover:bg-warning/90 w-full"
                >
                  Respond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
